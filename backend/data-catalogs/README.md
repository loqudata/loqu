# Data Portal / Catalog Scrapers

## Data Sources

- DataPortals.org is a list of over 500 data portals that use different software
  - We then run a Python script that gets the HTML of the page and looks for the data portal software string
- Open Data Portal Watch has a list of ~280 data portals that use CKAN, Socrata, and other standard software
  - This is supported by the open source PortalWatch conversion code
  - The website is down so it must be accessed via Internet Archive

## DataPortals.org Statistics

Number of data portals by software (detected by our basic script)
```sh
cat portals.json | jq -r '.[].software | select( . != null )' | sort | uniq -c | sort -nr
     77 ckan
     27 socrata
      9 opendatasoft
      3 ogdi
      3 dkan
      2 junar
      2 datapress
      1 dataverse
```

Number of data portals with included `api_endpoint`
```sh
cat portals.json | jq -r '.[].api_endpoint | select( . != null and . != "" and . != "NA" and . != "Not apparent" )' | wc -l
41
```

## Portal Watch

The number of portals went down from 254 in 2018 to 202 in 2020.

http://web.archive.org/web/20181009201807/http://data.wu.ac.at/portalwatch/portalslist

http://web.archive.org/web/20200926110902/https://data.wu.ac.at/portalwatch/portalslist

### Stats

From 2018, there were 147 CKAN instances.

106 / 147, or 72% were up using a basic http request to the homepage.


## TODOs:

- [ ] stronger typing with Python - eg use Quicktype to generate Dataclass objects, and decode the JSON into that. Replace dicts in Prefect intermediate steps with dataclasses.