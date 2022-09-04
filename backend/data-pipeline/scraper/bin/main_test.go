package main

import (
	"log"
	"testing"
)

func TestPaging(t *testing.T) {
	err := getDatasets("AMECO")
	if err != nil {
		log.Println(err)
		t.FailNow()
	}
}
