from glob import glob
import json
from posixpath import basename
import prefect
from logging import Logger
from prefect import task, Flow
from prefect.tasks.postgres import postgres
from prefect.tasks.shell import ShellTask

from prefect.tasks.secrets import PrefectSecret

import pandas as pd

from ckan.ckan import _normalize_portal, normalize_apiuri, skip_if_exists

import urllib.parse
import stringcase


from flows.config import PREFECT_CKAN_NEW


def create_short_id(normal_base_url: str):
    hostname = urllib.parse.urlparse(normal_base_url).netloc
    short_name = stringcase.snakecase(hostname).replace("/", "_")
    return short_name


postgres_formatted_csv_location = "../data/portalwatch_selected.csv"
postgres_data_loading_dir = "/mnt/data/pg_data_loading" #"/home/alex/c2/loqu-backend/pg_data_loading"


@task
def portalwatch_csv_select_rename():
    skip_if_exists(postgres_formatted_csv_location)
    col_mapping = {
        "apiuri": "api_endpoint_url",
        "software": "software_type",
        "iso": "country_code_iso2",
    }
    logger: Logger = prefect.context.get("logger")
    df = pd.read_csv(
        "../data/portalwatch_alldata_nocodb.csv",
        usecols=["apiuri", "software", "iso", "num_datasets"],
    )
    df.rename(columns=col_mapping, inplace=True)

    # Make NAs into zeroes
    df = df.fillna(0)
    # everything else is a string
    strs = {x: "string" for x in col_mapping.values()}
    df = df.astype({"num_datasets": "int", **strs})

    # logger.info(df)
    df["api_endpoint_url"] = df["api_endpoint_url"].apply(normalize_apiuri)  # , axis=1)
    df["api_short_id"] = df["api_endpoint_url"].apply(create_short_id)  # , axis=1)
    # logger.info(df)
    logger.info(postgres_formatted_csv_location)
    df.to_csv(postgres_formatted_csv_location, index=False)
    return postgres_formatted_csv_location


with open(PREFECT_CKAN_NEW + "real_ckan_license_ids.txt") as f:
    DEFAULT_LICENSES = f.read().splitlines()

@task
def filter_default_ckan_licenses(items: list[dict]):
    return list(
        map(
            lambda x: {**x, "licenses": list(
                filter(lambda l: l["id"] not in DEFAULT_LICENSES, x["licenses"])
            )},
            items,
        )
    )


@task
def get_licenses() -> list[dict]:
    license_ext = "_licenses.json"
    results = []
    for licensefile in glob(PREFECT_CKAN_NEW + "*" + license_ext):
        short_portal_id = basename(licensefile).split(license_ext)[0]
        # print(short_portal_id)
        with open(licensefile) as f:
            data = json.load(f)
            results.append({"short_portal_id": short_portal_id, "licenses": data})
    return results

@task
def prep_license_csv(items: list[dict]):
    """Takes a list of JSON records with short portal IDs and a list of licenses"""
    df = pd.json_normalize(items, record_path=["licenses"], meta=["short_portal_id"])
    # print(df)
    df = df[["id", "title", "url", "short_portal_id"]]
    df.rename(columns={"id": "original_id"}, inplace=True)

    # "short_portal_id": "portal_id"
    return df

# @task
# def load_portals_to_postgres():

shell = ShellTask()

import os

os.environ["PREFECT__LOGGING__LEVEL"] = "DEBUG"

load_task = postgres.PostgresExecute(
    "postgres",
    "postgres",
    "0.0.0.0",
    5432,
    "COPY app.portals(api_endpoint_url,software_type,country_code_iso2,num_datasets,api_short_id) FROM '/pg_data_loading/portalwatch_selected.csv' DELIMITER ',' CSV HEADER;",
    commit=True,
)


load_licenses_task = postgres.PostgresExecute(
    "postgres",
    "postgres",
    "0.0.0.0",
    5432,
    "COPY app.licenses(original_id,title,url,short_portal_id) FROM '/pg_data_loading/licenses2.csv' DELIMITER ',' CSV HEADER;",
    commit=True,
)


@task
def write_json(data: list[dict], name: str):
    with open("../data/" + name + ".json", "w") as f:
        json.dump(data, f)

@task
def write_csv(data: pd.DataFrame, name: str):
    data.to_csv("../data/" + name + ".csv", index=False)

with Flow("Load Portals to Postgres") as portals_load:
    logger: Logger = prefect.utilities.logging.get_logger("logger")
    portalwatch_csv_select_rename()
    cmd = f"cp {postgres_formatted_csv_location} {postgres_data_loading_dir}"
    logger.info(cmd)
    shell_res = shell(command=cmd)

    my_secret = PrefectSecret("POSTGRES")
    out = load_task(password=my_secret)
    logger.info(out)


with Flow("Load licenses to Postgres") as license_load:
    logger: Logger = prefect.utilities.logging.get_logger("logger")
    licenses = get_licenses()
    filtered = filter_default_ckan_licenses(licenses)
    write_json(filtered, "filtered")
    df = prep_license_csv(filtered)
    write_csv(df, "licenses2")

    licenses_file = "../data/licenses2.csv"
    cmd = f"cp {licenses_file} {postgres_data_loading_dir}"
    logger.info(cmd)
    shell_res = shell(command=cmd)

    my_secret = PrefectSecret("POSTGRES")
    out = load_licenses_task(password=my_secret)
    logger.info(out)

if __name__ == "__main__":
    # executor = DaskExecutor(address="tcp://0.0.0.0:8786", debug=True)
    license_load.run()  # executor=executor)
