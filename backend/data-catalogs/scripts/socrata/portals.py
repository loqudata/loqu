import logging
from typing import List

import requests
import json
import csv

base_url = "http://api.opendatanetwork.com/suggest/v1/publisher?limit=100&app_token=mI1UMSahnwzXm6On6xSnqI2HX&query="
from urllib.parse import urlparse
# log = logging.getLogger("default")
# log.setLevel(level="DEBUG")
# print("Starting with base url", base_url)

# "co", 
queries = ["gov", "org", "com", "ny", "nj", "ca", "la", "hhs", "performance", "dashboard", "data"]

def run_publisher_completion():
    kv = {}
    s = set()
    for query in queries:
        resp = requests.get(base_url + query).json()
        opts: List[dict] = resp["options"]
        out = [x["name"] for x in opts]
        s.update(out)
        kv[query] = out
    # print(json.dumps({"bySearch": kv, "unique": list(s)}))
    
# run_publisher_completion()
DATADIR = "../data/"
def compare_outputs():
    r = csv.reader(open(DATADIR+"domains2.csv"))

    from_api = set()
    for row in r:
        # print(row)
        from_api.add(row[1])
    
    val = json.load(open(DATADIR+"socrata.json"))
    arr = val["unique"]
    from_completion = set(arr)
    # both =from_completion.union(from_api)


    # v = json.load(open(DATADIR+"portals.json"))
    # from_okfn = set([urlparse(x["url"]).netloc for x in v])

    kv = {}
    
    kv["in API, not in completion"] = list(from_api.difference(from_completion))
    kv["in completion, not in API"] = list(from_completion.difference(from_api))
    kv["in completion and in API"] = list(from_completion.intersection(from_api))
    both =from_completion.union(from_api)

    out = filter(lambda x: not "socrata.com" in x, list(both))

    # with open(DATADIR + "newSocrata2", "w") as f:
    #     f.write("\n".join(out))
    
    # kv["in completion or in API"] = list(both)
    # kv["in okfn, not in completion or API"] = list(from_okfn.difference(both))
    # kv["in completion or API, not in okfn"] = list(both.difference(from_okfn))
    # kv["in both completion or API, and in okfn"] = list(both.intersection(from_okfn))

    for key in kv:
        value = kv[key]
        kv[key] = {
            "count": len(value),
            "value": value
        }

    # print(json.dumps(kv))



compare_outputs()