#!/bin/bash

portal=data.cityofchicago.org

for file in $(echo /mnt/data/prefect/socrata_typesense/$portal/output.json); do
    cat $file | mlr --j2c cat > $(dirname $file)/output.csv
done