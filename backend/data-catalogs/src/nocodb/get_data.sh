#! /bin/bash
SCRIPT_DIR=$(dirname "$0")

# https://stackoverflow.com/questions/19331497/set-environment-variables-from-file-of-key-value-pairs
set -o allexport
# source conf-file
source $SCRIPT_DIR/.env
set +o allexport

# conda activate base

# Default only queries 100 rows https://github.com/nocodb/nocodb/discussions/900

# portalwatch_dr8v

# Needs the %) to do the right search
curl -s -H "xc-auth: $NOCODB_AUTH_TOKEN" "$NOCODB_URL/nc/$WORKSPACE_ID/api/v1/$TABLE_ID?limit=500&where=(software,like,CKAN%)" | jq -c '[.[] | {apiuri: .apiuri, id: .id}]'