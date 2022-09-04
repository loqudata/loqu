from logging import Logger
import os
from typing import Any, Optional

# import path
# from typing import Union
# from unittest import result

import prefect
from prefect.engine.results.local_result import LocalResult
from prefect.engine.serializers import JSONSerializer

from prefect.executors import DaskExecutor
from prefect.engine.signals import LOOP, SKIP

from prefect.utilities.edges import unmapped

from prefect.tasks.shell import ShellTask

import requests

from prefect import task, Flow

import json

from dotenv import load_dotenv
import jsonlines
import urllib.parse
import stringcase

from flows.config import PREFECT_CKAN_NEW
from pathlib import Path

from json.decoder import JSONDecodeError
from urllib3.exceptions import InsecureRequestWarning

# Suppress only the single warning from urllib3 needed.
requests.packages.urllib3.disable_warnings(category=InsecureRequestWarning)

# unused
new_req = "/api/3/action/status_show"
old_req = "/api/util/status"
organization_req = "/api/3/action/organization_list"

SEARCH_NUM_DATASETS_REQ = "/api/3/action/package_search?rows=0&q="
LICENSE_REQ = "/api/3/action/license_list"

# UTILS
def skip_if_exists(file_path):
    try:
        p = Path(file_path)
        if p.exists():
            if not p.is_dir():
                raise SKIP(f"File {file_path} exists")
        # This behaviour might be unexpected
        # # If it exists and is a directory, we remove it
        # os.remove(file_path)
    except Exception as e:
        pass


import re


def normalize_apiuri(portal_url: str) -> str:
    """The portal URL sometimes ends in /catalog.ttl rather than /subpath/, so we normalize it"""
    base_url = re.sub("/catalog.ttl$", "", portal_url)
    base_url = base_url.rstrip("/")
    return base_url


def _normalize_portal(api_uri: str):
    base_url = normalize_apiuri(api_uri)
    parsed = urllib.parse.urlparse(base_url)
    new_endpoint = parsed.netloc + parsed.path
    short_name = stringcase.snakecase(new_endpoint).replace("/", "_")
    return {"normalized_name": short_name, "base_url": base_url}


# END UTILS


@task  # (task_run_name='prep {portal.apiuri}')
def normalize_portal(portal: dict):
    return _normalize_portal(portal["apiuri"])


@task
def prep_ckan_download(portal: dict, type: Optional[str] = None):
    normalized_name: str = portal["normalized_name"]
    # TODO: make this _datasets.jsonl
    download_path = PREFECT_CKAN_NEW + normalized_name + (f"_{type}" if type else "") + ".jsonl"
    skip_if_exists(download_path)
    portal["download_path"] = download_path
    return portal


@task
def prep_single_meta_download(portal: dict, type: str):
    normalized_name: str = portal["normalized_name"]
    # TODO: make this _datasets.jsonl
    download_path = PREFECT_CKAN_NEW + normalized_name + f"_{type}.json"
    skip_if_exists(download_path)
    portal["download_path"] = download_path
    return portal


@task(task_run_name="portal.base_url", skip_on_upstream_skip=True)
def download_ckan_licenses(portal: dict, limit=500):
    """
    Downloads the metadata for all datasets at a given CKAN portal endpoint, paging through the default search.
    TODO: investigate if using the package_list endpoint is better (seemed not entirely supported)
    """
    base_url: str = portal["base_url"]
    download_path: str = portal["download_path"]

    res = requests.get(base_url + LICENSE_REQ, timeout=5, verify=False)

    res.raise_for_status()

    try:
        data = res.json()
        license_list = data["result"]
        if not isinstance(license_list, list):
            raise Exception("Invalid CKAN API license data: " + json.dumps(data))
    # Truncate the errors b/c it prints entire HTML into logs
    except JSONDecodeError as e:
        # from None avoids printing originals
        raise Exception(str(e)[:100]) from None

    with open(download_path, "w") as f:
        json.dump(license_list, f)


@task(task_run_name="portal.base_url", skip_on_upstream_skip=True)
def download_ckan_data_paginated(portal: dict, limit=500, req_type: str = "dataset"):
    """
    Downloads the metadata for a resource type that uses a paginated CKAN portal endpoint.
    TODO: investigate if using the package_list endpoint is better for datasets (seemed not entirely supported)
    """
    base_url: str = portal["base_url"]
    download_path: str = portal["download_path"]

    logger: Logger = prefect.context.get("logger")
    loop_payload = prefect.context.get("task_loop_result", {})

    page = loop_payload.get("page", 0)
    # prev_list = loop_payload.get("list", [])
    offset = page * limit

    logger.info(f"Scraping CKAN {req_type} data from {base_url} to {download_path} - iteration {page}")

    if req_type == "dataset":
        req_url = "/api/3/action/package_search?q="
    elif req_type == "organization":
        req_url = "/api/3/action/organization_list?all_fields=true"
    else:
        raise Exception(f"Unknown request type {req_type} provided, cannot download CKAN paginated data")

    pagination_params = {
        # Map from request type to right params
        "dataset": {
            "limit": "rows",
            "offset": "start"
        },
        "organization": {
            "limit": "limit",
            "offset": "offset"
        }
    }

    data_accessors = {
        "dataset": lambda x: x["result"]["results"],
        "organization": lambda x: x["result"]
    }

    res = requests.get(
        base_url + req_url,
        params={pagination_params[req_type]["offset"]: offset, pagination_params[req_type]["limit"]: limit},
        timeout=5,
        verify=False,
    )

    res.raise_for_status()

    try:
        data = res.json()
        real_data = data_accessors[req_type](data)
    # Truncate the errors b/c it prints entire HTML into logs
    except JSONDecodeError as e:
        # from None avoids printing originals
        raise Exception(str(e)[:100]) from None

    if not isinstance(real_data, list):
        raise Exception("Invalid CKAN API data: " + json.dumps(data))

    # We asssume the file doesn't exist/has been removed (see prep_ckan_download), so each iteration of the loop can append
    # TODO: maybe add a date to the file name so we know when it ran (or Task/Flow ID)
    with jsonlines.open(download_path, "a") as jlf:
        jlf.write_all(real_data)

    length = len(real_data)

    logger.debug(
        f"current page: {page}, current start item/offset: {offset}, returned length: {length}, limit: {limit}"
    )

    if length < limit:
        # Done!
        return
    

    if length > limit:
        # Some error/illogical state with the server
        # Eg this endpoint: http://www.civicdata.io/api/3/action/organization_list?all_fields=true&limit=25, which returns all the organizations regardless of limit
        # We assume that we got all the data in this one go, and return
        return
    # length should be equal to limit

    raise LOOP(message=f"page {page}", result=dict(page=page + 1))


@task(task_run_name="portal.base_url")
def get_ckan_portal_num_datasets(portal: dict) -> dict:
    """Gets the number of datasets from a CKAN portal by running an empty search query"""
    base_url = portal["base_url"]
    
    logger: Logger = prefect.context.get("logger")
    try:
        um = base_url + SEARCH_NUM_DATASETS_REQ
        res = requests.get(
            um, timeout=5, verify=False
        )  # some issue with brazilian certs
        logger.info(f"made request to {res.url}")
        num_datasets = res.json()
        if num_datasets["success"] and num_datasets["result"]:
            num_datasets = num_datasets["result"]["count"]
        error = None
    except Exception as e:
        num_datasets = None
        error = str(e)
        error = error[:100]
        logger.error(error)
        # This will be filtered and won't update a DB portal record
        # return None

    return {**portal, "num_datasets": num_datasets}


# NOCODB_SCRIPT="src/nocodb/get_data.sh"
NOCODB_SCRIPT = "/home/alex/c2/data-catalogs/src/nocodb/get_data.sh"

get_portals_nocodb = ShellTask(
    command=NOCODB_SCRIPT, name="get_portals_nocodb"
)  # , return_all=True) #helper_script="cd ~")


@task
def extract_data_portals(
    raw_portal_data: str, start: Optional[int] = None, end: Optional[int] = None
) -> list[str]:
    data = json.loads(raw_portal_data)
    return data[start:end]


if __name__ == "__main__":
    load_dotenv("/home/alex/c2/data-catalogs/src/nocodb/.env")

NOCODB_URL = os.getenv("NOCODB_URL")
NOCODB_AUTH_TOKEN = os.getenv("NOCODB_AUTH_TOKEN")
WORKSPACE_ID = os.getenv("WORKSPACE_ID")
TABLE_ID = os.getenv("TABLE_ID")

DATA_DIR = "/home/alex/c2/data-catalogs/data/prefect/"
STATS_FILE = "ckan_dataset_stats_3.json"


@task(
    # TODO: it seems that calling `flow.run` from the regular Python process means the result is not persisted, so implemented custom file writer
)
def output(data: list[dict]):
    with open(DATA_DIR + STATS_FILE, "w") as f:
        json.dump(data, f)

    # body = list(filter(lambda x: x is not None, data))
    # logger.info(json.dumps(body))
    # res = requests.put(
    #     f"{NOCODB_URL}/nc/{WORKSPACE_ID}/api/v1/{TABLE_ID}/bulk",
    #     json=body,
    #     headers={"xc-auth": NOCODB_AUTH_TOKEN},
    #     timeout=5,
    # )
    # logger.info(f"made NocoDB update request to {res.url}: {res.text[:500]}")
    # res.raise_for_status()

    # print(data)
    return data


@task
def get_portals_postgrest():
    res = requests.get("http://localhost:5001/portals?or=(software_type.eq.CKAN,software_type.eq.CKANDCAT)")

    res.raise_for_status()

    data = res.json()
    if not isinstance(data, list):
        raise Exception("Invalid Postgrest portal data: " + json.dumps(data))

    return data


@task
def easier_normalize(portal: dict):
    return {
        "normalized_name": portal["api_short_id"],
        "base_url": portal["api_endpoint_url"],
    }


with Flow("Check CKAN Data Portals", result=LocalResult()) as check:
    logger = prefect.context.get("logger")
    
    portals = get_portals_postgrest()
    normalized = easier_normalize.map(portals)

    out = get_ckan_portal_num_datasets.map(normalized)
    output(out)


with Flow("Download CKAN Data Portal Metadata", result=LocalResult()) as datasets:
    logger = prefect.context.get("logger")
    raw_portal_data = get_portals_nocodb()

    portals = extract_data_portals(raw_portal_data)
    normalized = normalize_portal.map(portals)
    prepped = prep_ckan_download.map(normalized)
    download_ckan_data_paginated.map(prepped)


@task
def write_urls(data: list[dict]):
    # logger = prefect.context.get("logger")
    # logger.info(data)
    with open("../data/base_urls.txt", "w") as f:
        f.writelines(map(lambda x: x["base_url"] + "\n", data))


with Flow("Download CKAN Data Portal Base URLs", result=LocalResult()) as base_urls:
    logger = prefect.context.get("logger")
    raw_portal_data = get_portals_nocodb()

    portals = extract_data_portals(raw_portal_data)
    prepped = normalize_portal.map(portals)
    write_urls(prepped)


with Flow("Download CKAN Data Portal Licenses", result=LocalResult()) as licenses:
    logger = prefect.context.get("logger")

    portals = get_portals_postgrest()
    normalized = easier_normalize.map(portals)
    prepped = prep_single_meta_download.map(normalized, unmapped("licenses"))
    download_ckan_licenses.map(prepped)
    # write_urls(prepped)


with Flow("Download CKAN Data Portal Organizations", result=LocalResult()) as organizations:
    logger = prefect.context.get("logger")

    portals = get_portals_postgrest()
    normalized = easier_normalize.map(portals)
    prepped = prep_ckan_download.map(normalized, type=unmapped("organizations"))
    download_ckan_data_paginated.map(prepped, limit=unmapped(25), req_type=unmapped("organization"))


if __name__ == "__main__":
    executor = DaskExecutor(address="tcp://0.0.0.0:8786", debug=True)
    check.run()  # executor=executor)
