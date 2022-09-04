#!/bin/bash

trap "echo Exited!; exit;" SIGINT SIGTERM


ENDPOINT="http://localhost:8080"

requestID=$(cat recent.txt)

# OUT_DIR="./newOut"
OUT_DIR="/home/alex/data/virtuoso-links"

mkdir -p $OUT_DIR

while true; do
    if curl -s $ENDPOINT/results/$requestID | jq -e '.availableFiles'  >/dev/null  2>&1; then 
        break
    fi

    sleep 1
done;

files=$(curl -s $ENDPOINT/results/$requestID | jq -r '.availableFiles |join(" ")')

echo "Got available files:"
echo $files

echo "Downloading..."

for file in $files; do
    wget -O $OUT_DIR/$file $ENDPOINT/result/$requestID/$file
done