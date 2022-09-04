from logging import Logger
from os import strerror
from rdflib.graph import Graph
from .conversion.dataset_converter import convert_ckan
import requests
import json

from requests.models import Response

from .config import PREFECT_DATA_DIR

from prefect import task, Flow
from prefect.utilities.edges import unmapped

from prefect.engine.results import LocalResult
from prefect.engine.serializers import JSONSerializer

from prefect.run_configs import LocalRun
from prefect.executors import LocalDaskExecutor

from prefect.tasks.control_flow import FilterTask
from prefect import context

has_software_filter = FilterTask(filter_func=lambda x: len(x["software"]))
is_ckan = FilterTask(filter_func=lambda x: "ckan" in x["software"])

@task
def get_portals_with_software() -> list[dict]:
    data = json.load(open(PREFECT_DATA_DIR + "output.json"))
    
    # logger: Logger = prefect.context.get("logger")

    # logger.info("data: %s", data)
    
    return data

def fetch(url: str) -> Response:
    return requests.get(url, timeout=3)

# @task
# def get(portal: dict):
#     return fetch(portal["url"])

def do_ckan_action(address: str, action: str):
    url = address.rstrip('/') + '/' + 'api/action/' + action
    response = fetch(url).json()
    total = response["count"]
    

# def get_ckan()

@task
def convert(resp: Response, portal: dict) -> dict:
    logger: Logger = context.get("logger")

    logger.info("Starting conversion.")
    content = resp.json()
    graph = Graph()
    output = convert_ckan(graph, content, portal["url"])
    print(output)
    logger.info("Output IRI: %s", output)
    return output

with Flow("Scrape, Convert, and Store Data Portals Metadata") as flow:
    portals = get_portals_with_software()
    # Don't apply map to filters, will drill down too much
    sp = has_software_filter(portals)
    ckans = is_ckan(sp)
    
    # TODO: can we print the number of mapped tasks
    # flow.logger.info("Number of CKAN portals %i", len(ckans))
    out = get.map(ckans)
    converted = convert.map(out, ckans)

flow.run_config = LocalRun()
flow.executor = LocalDaskExecutor()

flow.run()
# flow.register(project_name="default", labels=["alex-brain"])