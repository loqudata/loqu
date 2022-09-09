PORTAL_SOURCE_URL = "https://github.com/okfn/dataportals.org/raw/master/data/portals.csv"
from typing import List

import asyncio

import httpx
# import json
import csv 

from prefect import task, flow, get_run_logger

from prefect_ray.task_runners import RayTaskRunner

# from prefect.utilities.edges import unmapped

# from prefect.engine.results import LocalResult
# from prefect.engine.serializers import JSONSerializer

# from prefect.run_configs import LocalRun
# from prefect.executors import LocalDaskExecutor

# They got rid of templated names
@task
async def check_data_portal(url: str, check_software: bool = False) -> dict:
    logger = get_run_logger()
    print("checking", url)
    logger.info(f"checking {url}")
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
    logger = get_run_logger()
    async with httpx.AsyncClient() as client:
        r = await client.get(PORTAL_SOURCE_URL, follow_redirects=True)
        logger.info(f"Got {len(r.text.splitlines())} lines from HTTP {r.status_code} response code from url {PORTAL_SOURCE_URL}")
        return r.text

@task
async def get_urls(inp: str) -> List[str]:
    logger = get_run_logger()
    logger.info(f"Starting to get urls {inp[:20]}")
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

@flow(task_runner=RayTaskRunner())
async def check_data_portals():
    logger = get_run_logger()

    logger.info("starting flow")
    portals = await fetch_portals()

    logger.info(f"got portals: {portals[:20]}")

    # for some reason the non-async function doesn't get called
    urls = await get_urls(portals)
    logger.info(f"got urls: {urls[:10]}")
    logger.info(f"Processing {len(urls)} urls.")

    coros = [check_data_portal(x) for x in urls]
    await asyncio.gather(*coros)
    # for x in urls:
    #     check_data_portal.submit(x)
    # output(out)

if __name__ == "__main__":

    asyncio.run(check_data_portals())
    # check_data_portals()

# flow.run_config = LocalRun()
# flow.executor = LocalDaskExecutor()

# flow.register(project_name="default", labels=["alex-brain"])