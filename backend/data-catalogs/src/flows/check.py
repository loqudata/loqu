import requests
import json
from flows.config import PREFECT_DATA_DIR

from prefect import task, Flow
from prefect.utilities.edges import unmapped

from prefect.engine.results import LocalResult
from prefect.engine.serializers import JSONSerializer

from prefect.run_configs import LocalRun
from prefect.executors import LocalDaskExecutor

SOFTWARE = ["ckan", "socrata", "datapress", "dataverse", "dkan", "junar", "ogdi", "opendatasoft",  "publishmydata"]

@task
def check_data_portal(url: str, check_software: bool = False) -> dict:
    try:
        html = requests.get(url, timeout=3).text.lower()
        sf = []
        if check_software:
            for s in SOFTWARE:
                # print(s)
                if s in html:
                    sf.append(s)
        
        return {
            "url": url,
            "active": True,
            "software": sf
        }
    except:
        return {
            "url": url,
            "active": False,
            "software": []
        }


@task
def get_urls() -> list[str]:
    data = json.load(open("./data.json"))
    urls = []
    for key in data:
        urls.append(data[key]["url"])
    return urls

# In the future the output task may load the data into the database. It may also merge with the original data.json
@task(result=LocalResult(dir=PREFECT_DATA_DIR, location="output.json", serializer=JSONSerializer()))
def output(data: list[dict]):
    return data

with Flow("Check Data Portals") as flow:
    # Mapping the URLs with dasks takes too long
    # urls = get_urls.map(get_portals()) 
    # check_software=unmapped(True))
    out = check_data_portal.map(get_urls(), check_software=unmapped(True)) 
    output(out)

flow.run_config = LocalRun()
flow.executor = LocalDaskExecutor()

flow.register(project_name="default", labels=["alex-brain"])