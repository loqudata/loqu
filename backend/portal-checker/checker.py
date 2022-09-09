PORTAL_SOURCE_URL = "https://github.com/okfn/dataportals.org/raw/master/data/portals.csv"
from typing import List

import asyncio

import httpx
# import json
import csv 

from prefect import task, flow, get_run_logger

from prefect_dask.task_runners import DaskTaskRunner

# from prefect.utilities.edges import unmapped

# from prefect.engine.results import LocalResult
# from prefect.engine.serializers import JSONSerializer

# from prefect.run_configs import LocalRun
# from prefect.executors import LocalDaskExecutor

# They got rid of templated names
@task
async def check_data_portal(url: str, check_software: bool = False) -> dict:
    logger = get_run_logger()
    out = None
    try:
        async with httpx.AsyncClient() as client:
            r = await client.get(url, timeout=5)
            html = r.text.lower()
        
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


@task
async def fetch_portals() -> str:
    async with httpx.AsyncClient() as client:
        r = await client.get(PORTAL_SOURCE_URL)
        return r.text

@task
def get_urls(inp: str) -> List[str]:
    reader = csv.reader(inp.splitlines())
    # https://stackoverflow.com/a/67363646
    headers = next(reader)
    data = [{h:x for (h,x) in zip(headers,row)} for row in reader]

    urls = []
    for portal in data:
        # print(portal)
        urls.append(portal["url"])
    return urls

# In the future the output task may load the data into the database. It may also merge with the original data.json
# @task(result=LocalResult(dir="./data", location="output.json", serializer=JSONSerializer()))
def output(data: List[dict]):
    return data

@flow(task_runner=DaskTaskRunner())
def check_data_portals():
    logger = get_run_logger()

    portals = fetch_portals()
    urls = get_urls(portals)
    print(urls)
    logger.info(f"Processing {len(urls)} urls.")

    out = check_data_portal.map(urls) 
    output(out)

if __name__ == "__main__":
    check_data_portals()

# flow.run_config = LocalRun()
# flow.executor = LocalDaskExecutor()

# flow.register(project_name="default", labels=["alex-brain"])