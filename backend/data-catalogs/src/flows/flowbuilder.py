from prefect.run_configs import LocalRun
from prefect.executors import LocalDaskExecutor
from prefect import Flow

from prefect import Client

from ckan.ckan import download

def submit_flow(flow: Flow):
    flow.run_config = LocalRun()
    flow.executor = LocalDaskExecutor()

    id = flow.register(project_name="default", labels=["alex-brain"])

    # Creating a flow run will cause it to be run even via pytest
    client = Client()
    client.create_flow_run(flow_id=id)

if __name__ ==  "__main__":
    submit_flow(download)