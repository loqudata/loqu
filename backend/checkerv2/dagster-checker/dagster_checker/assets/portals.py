PORTAL_SOURCE_URL = "https://github.com/okfn/dataportals.org/raw/master/data/portals.csv"

import csv
from distutils.command import check
from tkinter import OUTSIDE
import requests

from dagster import asset, op, job, get_dagster_logger, DynamicOut, DynamicOutput

from typing import Dict, List


@asset
def portals():
    response = requests.get(PORTAL_SOURCE_URL)
    lines = response.text.split("\n")
    portal_rows = [row for row in csv.DictReader(lines)]

    return portal_rows

@op(out=DynamicOut())
def get_urls(rows: List[Dict]) -> List[str]:
    idx = 0
    for x in rows:
        yield DynamicOutput(x, mapping_key=idx)
        idx+=1
    # return [x["url"] for x in rows]



@op
def check_data_portal(url: str) -> dict:
    logger = get_dagster_logger()
    print("checking", url)
    logger.info(f"checking {url}")
    out = None
    try:
        html = requests.get(url, timeout=5).text.lower()
        
        out = {
            "url": url,
            "active": True
        }
        logger.info(out)
        # return out
    except Exception as e:
        out = {
            "url": url,
            "active": False,
            "error": str(e)
        }
        logger.error(out)

    print(out)
    return out

@job
def check_data_portals():
    logger = get_dagster_logger()
    p = portals()
    urls = get_urls(p)
    results = urls.map(check_data_portal)
    out = results.collect()
    print(out)
    # return out

@asset
def portal_status():
    return check_data_portals()