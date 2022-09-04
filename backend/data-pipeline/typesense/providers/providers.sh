#!/bin/bash

DB_URL="http://localhost:8108"
TYPESENSE_API_KEY="aaeff9df"

# Get data
API_URL="https://api.db.nomics.world/v22"

curl $API_URL/providers | jq '.providers.docs | to_entries | map( ( .value.idx = "\(1+.key)"  ) | .value)' | jq -c '.[] | .idx = (.idx | tonumber)' >./tmp.jsonl

# Upload data
# If the documents have already been loaded, this will duplicate them
# curl -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" -X POST --data-binary @tmp.jsonl "$DB_URL/collections/providers/documents/import?action=create"

