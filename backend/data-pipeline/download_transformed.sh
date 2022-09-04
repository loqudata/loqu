#! /usr/bin/env bash
# upload:
# rclone copy /mnt/data/dbnomics/datasets --include '*.jsonld' dbnomics:dbnomics-dataset-metadata --dry-run

DBNOMICS_DATA_DIR="${DBNOMICS_DATA_DIR:-"$HOME/dbnomics_data"}"

mkdir $DBNOMICS_DATA_DIR
rclone copy :gcs:static.loqudata.org $DBNOMICS_DATA_DIR --gcs-anonymous -v
