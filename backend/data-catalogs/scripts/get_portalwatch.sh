#!/bin/bash

PORTALWATCH_API_URL=https://data.wu.ac.at/portalwatch/api/v1/system/list

DATA_DIR=$(readlink -f "$(dirname "$0")/../data")

curl $PORTALWATCH_API_URL | jq '[to_entries[] | .value]' > "$DATA_DIR/portalwatch_normalized.json"

mlr --j2c cat "$DATA_DIR/portalwatch_normalized.json" > "$DATA_DIR/portalwatch.csv"