#!/bin/bash

TYPESENSE_API_KEY=796a9fdd-7706-43ca-b63d-5be5dab46160

curl -X POST -H "x-typesense-api-key: $TYPESENSE_API_KEY" -d @collection.json https://search.loqudata.org/collections