# How to detect CKAN

It's a mystery

## Important operations

Status, not always supported

```
/api/3/action/status_show
```

Group list

Get total number of datasets:

```
/api/3/action/package_search?rows=0&q=
```

results.count

Get total number of resources:

https://demo.ckan.org/api/3/action/resource_search?limit=0&query=name:


Package show

https://demo.ckan.org/api/3/action/package_show?id=sample-dataset-1

has number of resources, tags

includes resources inline by default, which include size - useful to check.

### Helpful resources for understanding

API Blueprint: https://github.com/okfn/ckan-api-blueprint
More up to date swagger: https://github.com/vrk-kpa/opendata/blob/master/doc/Avoindata-rest-api_1.0.1_swagger.yaml

A different swagger: https://app.swaggerhub.com/apis/EU-Open-Data-Portal/eu-open_data_portal/0.8.0#/read/packageListPost

## Portals with non-fully-public

e.g. API keys

DataVic
Victoria Australia
Requires API key
https://www.developer.vic.gov.au/index.php?option=com_apiportal&view=apitester&usage=api&tab=tests&apiName=DataVic+CKAN+API&apiId=bae31b42-1fd9-4104-97a0-aa30ecaeea8a&managerId=1&type=rest&apiVersion=1.2.0&menuId=153&renderTool=1

## Quirks with status request

URL: api.vic.gov.au:443/datavic/v1.2/group_show

Some CKAN sites don't support the status request.
Also this discover API url was kinda reverse engineered from the site.

https://discover.data.vic.gov.au/api/3/action/status_show
`{"success": false, "error": {"message": "Invalid request"}}`

https://discover.data.vic.gov.au/api/3/action/group_list
https://discover.data.vic.gov.au/api/3/action/package_show?id=victorian-testing-site-locations-for-covid-19

## Different subdomains

`data.vic.gov.au` vs `discover.data.vic.gov.au`

`portal.datos.org.py` vs `portal.datos.org.py` (paraguay)

## Messed up comparison script

```
    "site_url": "https://opendata.terrassa.cat",
```

from API

but

```

    "url": "http://opendata.terrassa.cat/",
```

from HTML

## issues with certs
see data/ckan/certs.log

### scripts

```
cat /mnt/data/prefect/explicit/output.json | jq -r '.[] | select(.active == true) | select(.software != []) |  select(.software | contains(["ckan"]) | not )'
```

From API
```
cat {./data/ckan/versions.json,./data/ckan/versions2.json}  | jq '[.[] | select(.ckan != null)] | length'
66
110
```

Changes were:
- disable HTTPs checking
- append to existing base URL (eg to have CKAN mounted on sub-path)

like old version also checks multiple versions

https://gist.githubusercontent.com/alexkreidler/27d3af2e55b4b50fd9c8c2ceefd41bb2/raw/ab93ba868c1f9ae6023779724a2e9e0e86d5e3c7/versions.json

Thought it was an increase. Turns out not much.

66 -> 70
actual good CKAN responses.

Total number of datasets on CKAN portals

```
cat /mnt/data/prefect/ckan/ckan_datasets.json | jq '.[] | select(.ckan != null) | .ckan.count' | paste -s -d+ - | bc
282007
```

282k

cat /mnt/data/prefect/ckan/ckan_datasets2.json | jq '.[] | select(.ckan != null) | .ckan.count' | paste -s -d+ - | bc
242821

## NSW data

opengov publications

https://www.opengov.nsw.gov.au/api


data.nsw.au
also at
https://uatweb.datansw.links.com.au/

domain: https://linkdigital.com.au/

uat acronym from CKAN

Finally found it:
https://data.nsw.gov.au/data/api/3/
https://data.nsw.gov.au/data/api/3/action/group_list

Only through DevTools and this i18n request: https://data.nsw.gov.au/data/api/i18n/en
Also appears they are loading Magda for the frontend


Don't worry about limiting scraping requests until actually need more than 2 per domain.

Status req.
Then number of datasets

Maybe group list
and robots.txt for info.

## What list of CKAN resources

```
$ cat /mnt/data/prefect/ckan/ckan_datasets3.json | jq '.[] | select(.ckan != "") | select(.ckan != 0) | .ckan.count' | paste -s -d+ - | bc                                                    (scraper) 
224395
$ cat /mnt/data/prefect/ckan/ckan_datasets2.json | jq '.[] | select(.ckan != "") | select(.ckan != 0) | .ckan.count' | paste -s -d+ - | bc                                                    (scraper) 
242821
```

## Performance notes

In the (single-threaded?) local mode, it (can) take 1-3 minutes to make all the requests

`14:08:14-0500 -> 14:09:40-0500