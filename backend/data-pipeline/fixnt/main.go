/**This tool reads all the N-Triples data files, checks for errors,
and moves the bad files to another directory, so the good files can be loaded
*/
package main

import (
	"log"
	"os"
	"path"
	"strings"
	"sync"
	"sync/atomic"

	"github.com/alexkreidler/dbnomics/fixnt/utils"
	"github.com/iand/ntriples"
)

const CONCURRENCY = 5
const DATA_DIR = "/mnt/data/dbnomics/datasets"
const BAD_DATA_DIR = "/mnt/data/dbnomics/bad-data"

func checkAndMaybeMove(filename string) error {
	ntfile, err := os.Open(filename)
	if err != nil {
		return err
	}
	defer ntfile.Close()

	count := 0
	r := ntriples.NewReader(ntfile)

	for r.Next() {
		count++
	}

	if r.Err() != nil {
		err = os.Rename(filename, path.Join(BAD_DATA_DIR, path.Base(filename)))
	}
	return err
}

var ops uint64 = 1

func main() {
	matches, _ := utils.Glob(DATA_DIR, ".nt")

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

				if fileIndex%300 == 0 {
					log.Printf("Checking file #%d: %s \n", fileIndex, fileName)
				}
				err := checkAndMaybeMove(fileName) // do the thing
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
