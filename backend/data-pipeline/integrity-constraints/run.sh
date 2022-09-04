#!/bin/bash

file=../converter/example-orig.nt

echo "Starting RDF Data Cube Constraint Checker"
echo "Input file: $file"
# echo "true indicates that a constraint failed, false that it passed, and neither means that the SPARQL query errored"
echo
echo

# set -euxo

function do_sparql() {
    errlog=$(mktemp)
    comunica-sparql-file -q "$(echo $1)" $2 2> "$errlog"
    if [[ -s "$errlog" ]]; then
        # File exists and has a size greater than zero
        echo "error"
    fi
}


for constraint_file in ./IC-{1..21}.rq; do
    if echo "$constraint_file" | grep -q "prefixes"; then
        continue;
    fi;
    query=$(cat ./prefixes.rq $constraint_file)

    echo -n "$constraint_file: "

    out=$(do_sparql "$query" $file)

    if [[ "$out" == "false" ]]; then
        echo "Passed"
    elif [[ "$out" == "true" ]]; then
        echo "Failed"
    elif [[ "$out" == "error" ]]; then
        echo "Errored"
    fi

    # echo "---"
done;