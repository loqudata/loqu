"""Converts Socrata dataset files into our more normalized but compact JSON format for search by Typesense"""
import json
import glob
import os
from posixpath import basename
import sys
from typing import Any, Union
from dateutil.parser import parse
import structlog
import pathlib

import contextlib
# import math

from prefect import task, Flow

from frequency import get_frequency_from_metadata

logger = structlog.get_logger()

def process_dataset(dataset: dict) -> dict:
    """Processes a dataset with structure from the Socrata Metadata API, aka the indiviudal JSON files on disk"""
    updates = [
        dataset.get("updatedAt"),
        dataset.get("dataUpdatedAt"),
        dataset.get("metadataUpdatedAt"),
    ]  # , dataset.get("metadata_updated_at"),  dataset.get("data_updated_at")
    most_recent = sorted(
        [parse(timeString) for timeString in filter(lambda x: x is not None, updates)]
    )[-1]
    # These return python ints which are int64s, and will not run out of space till earth is over
    most_recent_ts = round(most_recent.timestamp())
    created_at_ts = round(parse(dataset.get("createdAt")).timestamp())

    fds = dataset.get("customFields")

    freq = get_frequency_from_metadata(fds) if fds is not None else None

    return {
        "id": dataset["id"],
        "name": dataset["name"],
        "description": dataset.get("description"),
        "created_at": created_at_ts,
        "updated_at": most_recent_ts,
        "update_frequency": freq,
        "portal_source": dataset["domain"],
        "portal_type": "socrata",
        "formats": ["csv", "json"]
    }


sizes = []

# portal = "data.cityofchicago.org" # "healthdata.gov"
source_dir = "/mnt/data/prefect/new"
output_dir = "/mnt/data/prefect/typesense_2"


def write_convert(input_file: str, output_file: str) -> dict:
    out = process_dataset(json.load(open(input_file)))
    # we are appending
    with open(output_file, "a") as out_file:
        out_file.write(json.dumps(out) + "\n")
    return out
    # logger.info("wrote_file", file_name=file_name, size=sz)


pathlib.Path(output_dir).mkdir(parents=True, exist_ok=True)

for portal_dir in glob.glob(f"{source_dir}/*"):
    portal = basename(portal_dir)
    
    output_file_name = f"{output_dir}/{portal}.jsonl"
    if os.path.exists(output_file_name):
        continue

    # we remove the file if it exists because we will append to it
    with contextlib.suppress(FileNotFoundError):
        os.remove(output_file_name)

    logger.info("starting_conversion", portal=portal, output_file_name=output_file_name)

    input_files = glob.glob(f"{portal_dir}/*.json")
    for file in input_files:
        if "discoveryAPI" not in file:
            write_convert(file, output_file_name)
    
    logger.info("done_portal_file", num_datasets=len(input_files), output_file_name=output_file_name)