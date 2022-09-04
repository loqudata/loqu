# Socrata Scraper

Downloads dataset metadata from Socrata endpoints.

## Endpoint List

There are several different ways that we can get Socrata API endpoint URLs to scrape.

1. DataPortals/DataCatalogs.org - same site; Open Data Portal Watch
2. User submissions/curation (NocoDB)
3. Socrata's Discovery API: `http://api.us.socrata.com/api/catalog/v1/domains` - lists all domains and count of datasets
4. Socrata's Publisher suggestion autocompletion API: `http://api.opendatanetwork.com/suggest/v1/publisher?limit=100&query=`

## Metadata Downloads

We just download each dataset into directories named after the web site, in individual JSON files based on the 4 id, like `data.richmondgov.com/d5f2-puzi.json`. (`download.py`)


## Conversion

Then we clean up the data for indexing by typesense, and aggregate each portal into one JSONL file, like `highways.hidot.hawaii.gov.jsonl`. This involves parsing the timestamps and trying to recognize the update frequency field. (`convert.py`)