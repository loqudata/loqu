#!/bin/bash

for schema in $(dirname "$0")/*.json; do
    # httpie automatically sets content type?
    http POST "$TYPESENSE_SERVER_ADDR/collections" "x-typesense-api-key: ${TYPESENSE_API_KEY}" < $schema
done
