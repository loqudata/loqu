package main

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"os"
	"path"
	"strings"
	"sync"
	"sync/atomic"

	"github.com/alexkreidler/dbnomics/jsonld2nt/utils"
	"github.com/piprate/json-gold/ld"

	"github.com/DmitriyVTitov/size"
)

func Exists(name string) (bool, error) {
	_, err := os.Stat(name)
	if os.IsNotExist(err) {
		return false, nil
	}
	return err != nil, err
}

var ops uint64

// var skipped uint64

func doConvert(proc *ld.JsonLdProcessor, options *ld.JsonLdOptions, filename string) error {
	infile := filename
	ext := path.Ext(infile)
	outfile := infile[0:len(infile)-len(ext)] + ".nt"

	// alreadyExists, err := Exists(outfile)
	// if err != nil {
	// 	return err
	// }
	// if alreadyExists {
	// 	atomic.AddUint64(&skipped, 1)
	// 	// Don't want to re-convert
	// 	return nil
	// }

	dat, err := ioutil.ReadFile(filename)
	if err != nil {
		return err
	}
	var v interface{}
	err = json.Unmarshal(dat, &v)
	if err != nil {
		return err
	}

	out := size.Of(v)
	if out > 1000000 {
		log.Printf("inmemory size of file %s is %d", filename, out)
	}

	if out > 10000000 {
		log.Printf("file %s is too big: %d", filename, out)
		return nil
	}

	triples, err := proc.ToRDF(v, options)
	if err != nil {
		return err
	}
	td := []byte(triples.(string))

	err = ioutil.WriteFile(outfile, td, 0664)
	if err != nil {
		return err
	}

	return err
}

const CONCURRENCY = 5
const DATA_DIR = "/mnt/data/dbnomics/datasets"

func main() {
	matches, _ := utils.Glob(DATA_DIR, ".jsonld")

	proc := ld.NewJsonLdProcessor()
	options := ld.NewJsonLdOptions("")
	options.Format = "application/n-quads"
	// options.Format = "text/turtle"

	// Set up concurrency
	var ch = make(chan string) // This number 50 can be anything as long as it's larger than xthreads
	var wg sync.WaitGroup

	// This starts xthreads number of goroutines that wait for something to do
	wg.Add(CONCURRENCY)
	for i := 0; i < CONCURRENCY; i++ {
		go func() {
			for {
				fileName, ok := <-ch
				if !ok { // if there is nothing to do and the channel has been closed then end the goroutine
					wg.Done()
					return
				}
				// These two files just deadlock my CPU at 500% for ~2mins
				if strings.Contains(fileName, "RDE") || strings.Contains(fileName, "RDF") || strings.Contains(fileName, "YC") {
					continue
				}

				fileIndex := atomic.LoadUint64(&ops)
				// skipped := atomic.LoadUint64(&skipped)
				skipped := 0
				if fileIndex%100 == 0 {
					log.Printf("Already skipped %d. Converting file #%d: %s \n", skipped, fileIndex, fileName)
				}
				err := doConvert(proc, options, fileName) // do the thing
				if err != nil {
					log.Println(err)
				}

				atomic.AddUint64(&ops, 1)
			}
		}()
	}

	for _, match := range matches {
		ch <- match
	}

	close(ch) // This tells the goroutines there's nothing else to do
	wg.Wait() // Wait for the threads to finish
}
