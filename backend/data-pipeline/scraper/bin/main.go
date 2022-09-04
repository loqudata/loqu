package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"strconv"
	"sync"

	"github.com/ohler55/ojg/gen"
	"github.com/ohler55/ojg/jp"
	"github.com/ohler55/ojg/oj"
)

const concurrency = 5 // Total number of threads to use, excluding the main() thread

const API_URL = "https://api.db.nomics.world/v22"

const DATA_DIR = "/mnt/data/dbnomics/datasets"

// This tool will make up to 25 requests at a time (if all 5 of first set have created 5 of second)

func get(relativeURL string) ([]byte, error) {
	resp, err := http.Get(API_URL + relativeURL)
	if err != nil {
		return nil, err
	}

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}
	// out := string(body)
	return body, nil
}

func getDatasets(providerID string) error {
	// log.Println("Fetching datasets for", providerID)
	err := os.MkdirAll(DATA_DIR+"/"+providerID, 0755)
	if err != nil {
		log.Fatalln(err)
	}

	lim := 500

	body, err := get("/datasets/" + providerID + "?limit=" + strconv.Itoa(lim))
	if err != nil {
		return fmt.Errorf("ERROR: failed to get provider %s", providerID)
	}

	var p gen.Parser

	obj, err := p.Parse(body)
	if err != nil {
		return fmt.Errorf("ERROR: failed to parse limit from provider %s", providerID)
	}

	limitExpr, err := jp.ParseString(".datasets.limit")
	if err != nil {
		log.Fatalln(err)
	}
	limRes := limitExpr.Get(obj)
	if len(limRes) != 1 {
		return fmt.Errorf("ERROR: multiple values returned for limit from provider %s", providerID)
	}
	limit := limRes[0].(gen.Int).Simplify().(int64)

	totalExpr, err := jp.ParseString(".datasets.num_found")
	if err != nil {
		return fmt.Errorf("ERROR: failed to parse total datasets from provider %s", providerID)
	}
	totalRes := totalExpr.Get(obj)
	if len(totalRes) != 1 {
		return fmt.Errorf("ERROR: multiple values returned for limit from provider %s", providerID)
	}
	total := totalRes[0].(gen.Int).Simplify().(int64)

	var datasets []gen.Node

	// We want to load the datasets from the first request, even if we need to make more reqs.
	datasetsExpr, err := jp.ParseString(".datasets.docs[*]")
	if err != nil {
		return fmt.Errorf("ERROR: failed to get documents for provider %s.", providerID)
	}
	res := datasetsExpr.GetNodes(obj.(gen.Node))
	for _, node := range res {
		datasets = append(datasets, node)
	}

	if total > limit {
		// Need to make additional requests to handle this
		// Don't want to write now
		log.Println("INFO: found more datasets than limit for provider", providerID)

		var handled int64 = 1

		// handled is the number of pages handled or the offset
		for ; (handled * limit) < total; handled++ {
			url := "/datasets/" + providerID + "?offset=" + strconv.FormatInt(handled*limit, 10) + "&limit=" + strconv.Itoa(lim)

			body, err := get(url)
			if err != nil {
				return fmt.Errorf("ERROR: failed to get %d page of datasets for provider %s. ", handled, providerID)
			}

			v, err := p.Parse(body)

			datasetsExpr, err := jp.ParseString(".datasets.docs[*]")
			if err != nil {
				return fmt.Errorf("ERROR: failed to get documents for provider %s.", providerID)
			}
			res := datasetsExpr.GetNodes(v)

			for _, node := range res {
				datasets = append(datasets, node)
			}
		}

	}

	written := 0
	for _, node := range datasets {
		out := oj.JSON(node, &oj.Options{Sort: true})

		codeExpr, err := jp.ParseString("code")
		if err != nil {
			log.Printf("ERROR: failed to get code for dataset in provider %s, skipping. \n", providerID)
			continue
		}

		codeRes := codeExpr.Get(node)
		if len(codeRes) != 1 {
			log.Println("ERROR: not 1 values returned for code from dataset, skipping.")
			continue
		}
		code := codeRes[0].(gen.String).Simplify().(string)

		outFile := DATA_DIR + "/" + providerID + "/" + code + ".json"
		err = os.WriteFile(outFile, []byte(out), 0666)
		if err != nil {
			log.Printf("ERROR: failed to write file %s, skipping.\n", outFile)
			continue
		}
		written++
	}

	log.Printf("INFO: wrote %d out of %d datasets to files for provider %s\n", written, len(datasets), providerID)

	return nil
}

func main() {

	body, err := get("/providers")
	if err != nil {
		log.Fatalln(err)
	}

	obj, err := oj.Parse(body)

	x, err := jp.ParseString(".providers.docs[*].code")
	ys := x.Get(obj)

	// Set up concurrency
	var ch = make(chan string) // This number 50 can be anything as long as it's larger than xthreads
	var wg sync.WaitGroup

	// This starts xthreads number of goroutines that wait for something to do
	wg.Add(concurrency)
	for i := 0; i < concurrency; i++ {
		go func() {
			for {
				a, ok := <-ch
				if !ok { // if there is nothing to do and the channel has been closed then end the goroutine
					wg.Done()
					return
				}
				err := getDatasets(a) // do the thing
				if err != nil {
					log.Println(err)
				}
			}
		}()
	}

	for _, a := range ys {
		key := a.(string)
		// log.Println(key)
		ch <- key
	}

	close(ch) // This tells the goroutines there's nothing else to do
	wg.Wait() // Wait for the threads to finish
}
