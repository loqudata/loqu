#!/bin/bash

trap "echo Exited!; exit;" SIGINT SIGTERM

ENDPOINT="http://localhost:8080"

# Unclear why HTTPie doesn't  work
# http --verbose --multipart POST 'http://localhost:8080/submit' config_file=@./virtuoso-ecb-dbpedia.xml
#  'Content-Type:application/xml'

if [ $# -ne 1 ]; then
    echo "Error: You need to provide one file as an argument to submit"
    exit
fi

FILE=$1

request=$(curl -F config_file=@$FILE  $ENDPOINT/submit | jq -r '.requestId')

echo $request > recent.txt