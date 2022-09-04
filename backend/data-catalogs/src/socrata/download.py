from logging import Logger
import os
import prefect
from prefect.core.task import Parameter
from prefect.schedules.schedules import Schedule
from prefect.utilities.edges import unmapped
import requests
import json
from flows.config import PREFECT_SOCRATA

from prefect import task, Flow, flatten

from prefect.engine.results import LocalResult
from prefect.engine.serializers import JSONSerializer

from prefect.engine.signals import LOOP
import ulid

import pathlib

SCRIPT_PATH = os.path.dirname(os.path.realpath(__file__))
# LOCAL_DATA_PATH = os.path.join(SCRIPT_PATH, "../data")
# 
print("SCRIPT_PATH", SCRIPT_PATH)

@task
def basic_check_portal(url: str):
    requests.get(url, timeout=3)


@task
def get_metadata_socrata_discovery(domain: str, limit=5):
    """Gets the metadata from the Socrata discovery API.
    This is really just to compare their total value from the total we calculate from our other direct requests.
    So the limit can be very small, we don't really actually want the metadata from this request, although it may be faster,
    because it is probably incomplete. How incomplete? well that may change the strategy of Discovery or Metadata API in the future.
    This metadata API does seem to have column data without any other requests though.
    """
    res = requests.get(
        "http://api.us.socrata.com/api/catalog/v1",
        params={"domains": domain, "limit": limit},
    )

    logger: Logger = prefect.context.get("logger")
    logger.info(f"made request to {res.url}")

    d = PREFECT_SOCRATA + domain
    pathlib.Path(d).mkdir(parents=True, exist_ok=True)
    p = d + "/discoveryAPI.json"
    with open(p, "w") as f:
        # This only works when JSON, aren't checking content type
        f.write(res.text)


@task
def download_socrata_dataset_metadata(portal_hostname: str, limit=500):
    """
    Downloads the metadata for all datasets hosted at a given Socrata portal hostname.
    """
    logger: Logger = prefect.context.get("logger")
    loop_payload = prefect.context.get("task_loop_result", {})

    page = loop_payload.get("page", 0)
    prev_list = loop_payload.get("list", [])

    res = requests.get(
        "https://" + portal_hostname + "/api/views/metadata/v1",
        params={"page": page, "limit": limit},
    )

    datasets_list = res.json()

    if not isinstance(datasets_list, list):
        raise "The response is not a list"

    p = PREFECT_SOCRATA + datasets_list[0]["domain"]
    pathlib.Path(p).mkdir(parents=True, exist_ok=True)

    for ds in datasets_list:
        domain = ds["domain"] if ds["domain"] is not None else "unknown"
        id = ds["id"] if ds["id"] is not None else "unknown_ID_" + ulid.new()

        with open(PREFECT_SOCRATA + domain + f"/{id}.json", "w") as f:
            # This only works when JSON, aren't checking content type
            json.dump(ds, f, indent=4)

    length = len(datasets_list)
    logger.info(f"{length}, {limit}")
    if length < limit:
        return

    raise LOOP(message=f"page {page}", result=dict(page=page + 1))


@task
def get_socrata_hosts() -> list[str]:
    lines = open("/home/alex/c2/data-catalogs/data/newSocrata").read()
    urls = lines.splitlines()
    # data = json.load(open("./data.json"))
    # urls = []
    # for key in data:
    #     urls.append(data[key]["url"])
    return urls #["data.cityofchicago.org"]  # evergreen.data.socrata.com


@task
def check_same(domain: str) -> dict:
    """This checks that the number of datasets from the direct metadata vs Discovery API are the same"""

    dir = PREFECT_SOCRATA + domain

    apiFile = dir + "/discoveryAPI.json"
    apiData = json.load(open(apiFile))
    numResults = apiData["resultSetSize"]

    num = 0
    with os.scandir(dir) as it:
        for _ in it:
            num += 1

    same = numResults == num

    return {"domain": domain, "discovery": numResults, "meta": num, "same": same}


@task(
    result=LocalResult(
        dir=PREFECT_SOCRATA, location="summary.json", serializer=JSONSerializer()
    )
)
def output(item: dict):
    return item


with Flow("New Download Socrata Data Portals") as flow:
    portals = get_socrata_hosts()
    discoveryAPI = get_metadata_socrata_discovery.map(portals)
    datasetMetadata = download_socrata_dataset_metadata.map(portals)
    final_out = check_same.map(
        portals, upstream_tasks=[unmapped(discoveryAPI), unmapped(datasetMetadata)]
    )
    output(final_out)


# flow.run()
