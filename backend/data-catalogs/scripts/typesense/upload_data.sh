#!/bin/bash

TYPESENSE_API_KEY=796a9fdd-7706-43ca-b63d-5be5dab46160
TYPESENSE_URL=https://search.loqudata.org/
DATA_DIR=/mnt/data/prefect/typesense_2
COLLECTION=datasets_2

for file in $(echo ${DATA_DIR}/*.jsonl); do
    cat $file | jq -c 'with_entries( select( .value != null ) )' | curl -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" -X POST --data-binary @- "${TYPESENSE_URL}/collections/${COLLECTION}/documents/import?action=create"
done
