#!/bin/bash

dir=${1:-"./"}
# /mnt/data/dbnomics/datasets/ISTAT

find $dir/ -name '*.json' | rush 'cat {} | jq "{name, description, provider_code, converted_at, nb_series}" | wc -c - | cut -d' ' -f 1'