#!/bin/bash

# dir=${1:-"/mnt/data/prefect/new/"}
# /mnt/data/dbnomics/datasets/ISTAT

for file in $(echo /mnt/data/prefect/new/**/discoveryAPI.json); do
    domain=$(basename $(dirname $file))
    cat $file | jq '{numDatasets: .resultSetSize}' | jq --arg d $domain '. + {domain: $d}'
done