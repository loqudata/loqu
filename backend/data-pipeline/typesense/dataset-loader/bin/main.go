package main

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"os"
	"sync"
	"sync/atomic"

	"github.com/loqudata/data-pipeline/typesense/dataset-loader/models"
	"github.com/loqudata/data-pipeline/typesense/dataset-loader/utils"

	"github.com/typesense/typesense-go/typesense"
	"github.com/typesense/typesense-go/typesense/api"
)

const CONCURRENCY = 5 // Total number of threads to use, excluding the main() thread

func readDataset(file string) (*models.Dataset, error) {
	body, err := ioutil.ReadFile(file)
	if err != nil {
		return nil, err
	}

	var dataset models.Dataset
	err = json.Unmarshal(body, &dataset)
	if err != nil {
		return nil, err
	}
	return &dataset, nil
}

var id uint64

func getValues(myMap map[string]string) []string {
	values := make([]string, 0, len(myMap))
	for _, v := range myMap {
		values = append(values, v)
	}
	return values
}

func convertDataset(ds *models.Dataset) *models.TypeSenseModel {
	// var []string is null, make([]string, 0) is []
	dimensionsValuesLabels := make([]string, 0)
	for _, v := range ds.DimensionsValuesLabels {
		dimensionsValuesLabels = append(dimensionsValuesLabels, getValues(v)...)
	}

	attributesValuesLabels := make([]string, 0)
	if ds.AttributesValuesLabels != nil {
		for _, v := range *ds.AttributesValuesLabels {
			attributesValuesLabels = append(attributesValuesLabels, getValues(v)...)
		}
	}

	attributeLabels := make([]string, 0)
	if ds.AttributesLabels != nil {
		attributeLabels = getValues(*ds.AttributesLabels)
	}

	return &models.TypeSenseModel{
		Index:           atomic.LoadUint64(&id),
		ProviderCode:    ds.ProviderCode,
		Code:            ds.Code,
		ProviderName:    ds.ProviderName,
		Name:            ds.Name,
		Description:     ds.Description,
		Dimensions:      ds.DimensionsCodesOrder,
		DimensionLabels: getValues(ds.DimensionsLabels),
		DimensionValues: dimensionsValuesLabels,

		AttributeLabels: attributeLabels,
		AttributeValues: attributesValuesLabels,
	}
}

func submitDataset(ds *models.TypeSenseModel, client *typesense.Client) error {
	_, err := client.Collection("datasets").Documents().
		Import([]interface{}{ds}, &api.ImportDocumentsParams{
			Action:    "create",
			BatchSize: 40})

	return err
}

func convertAndSubmitDataset(file string) error {
	ds, err := readDataset(file)
	if err != nil {
		return err
	}
	out := convertDataset(ds)
	client := typesense.NewClient(
		typesense.WithServer(utils.Getenv("TYPESENSE_SERVER_ADDR", "http://localhost:8108")),
		typesense.WithAPIKey(os.Getenv("TYPESENSE_API_KEY")))

	err = submitDataset(out, client)
	if err != nil {
		return err
	}

	// log.Println("Submitted dataset", out.Code)
	return nil
}

func main() {
	log.Println("Starting dbnomics JSON to typesense loader")

	// Let's just use the glob function to get all JSON files
	// 40 bytes * 22 000 datasets = 880 kilobytes of filenames in memory: no Problem

	matches, _ := utils.Glob(os.Getenv("DBNOMICS_DATA_DIR"), ".json")

	// Set up concurrency
	var ch = make(chan string) // This number 50 can be anything as long as it's larger than xthreads
	var wg sync.WaitGroup

	// This starts xthreads number of goroutines that wait for something to do
	wg.Add(CONCURRENCY)
	for i := 0; i < CONCURRENCY; i++ {
		go func() {
			for {
				a, ok := <-ch
				if !ok { // if there is nothing to do and the channel has been closed then end the goroutine
					wg.Done()
					return
				}
				err := convertAndSubmitDataset(a) // do the thing
				if err != nil {
					log.Println(err)
				}
			}
		}()
	}

	for _, match := range matches {
		ch <- match
	}

	close(ch) // This tells the goroutines there's nothing else to do
	wg.Wait() // Wait for the threads to finish

}
