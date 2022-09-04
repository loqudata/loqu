#!/bin/bash

curl https://search.loqudata.org/keys -X POST \
    -H "x-typesense-api-key: $TYPESENSE_API_KEY" \
    -H 'Content-Type: application/json' \
    -d '{"description":"Search-only companies key.","actions": ["documents:search"], "collections": ["datasets_2"]}'
