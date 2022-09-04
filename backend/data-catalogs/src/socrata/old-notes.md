
Exploratory scripts to decode the various Socrata APIs and determine the best portal scraping approach.

Used example dataset 6udu-fhnu
from 
http://evergreen.data.socrata.com/api/views/metadata/v1/6udu-fhnu/


GET
/api/views/metadata/v1?limit=100

http://evergreen.data.socrata.com/api/views/metadata/v1/uuid

eg
https://data.cityofchicago.org/api/views/metadata/v1/ydr8-5enu.json

https://yoursocratadomain.com/api/views/xxxx-xxxx/rows.json 
/columns.json
gets you column data

http://evergreen.data.socrata.com/api/views/metadata/v1/6udu-fhnu/

https://data.cdc.gov/api/views/mr8w-325u
https://yoursocratadomain.com/api/views/xxxx-xxxx

https://data.cityofchicago.org/api/views/ydr8-5enu

https://data.cityofchicago.org/api/views/ydr8-5enu.json

^found the above from https://axibase.com/docs/axibase-collector/jobs/socrata.html

https://data.cityofchicago.org/api/views/metadata/v1?limit=100

## Data conversion

Most recent data update: `rowsUpdatedAt`

## bugs

When we request from http://evergreen.data.socrata.com/ with limit and page, it is consistently 8 results less than what it should be 


recommendations, linnks to other platforms


onboarding
academically, professionally

largest in the world
most open data in one place


The discovery API doesn't have the latest datasets
data.drpt.virginia.gov - 117 datasets
http://api.us.socrata.com/api/catalog/v1?domains=data.drpt.virginia.gov&limit=100
but the above discovery API gives 2

## Download Flow verification
```
cat /mnt/data/prefect/explicit/socrata_out2.json | jq -r '.[].id' | sort | uniq | wc -l

cat /mnt/data/prefect/explicit/socrata_out2.json | jq -r '.[].id' | sort | uniq -c
```

## Decisions

Metadata exists on the data portals. We can always fetch it again. In fact, we will at least each week.
So it's OK if we fail in the middle of one portal. We can retry it.
It's OK if we miss a few datasets. They might be removed anyways.

## DUH

just because an example showed pagination with a loop doesn't mean we have to.

Can make the page requests in paralell, as long as the server has a consistent order and doesn't get confused (shouldn't)

Then, since chunking out datasets by unique-to-domain IDs, all fine to write to disk.

The one thing is that the metadata thing doesn't give the total number of datasets. so you need to continue till you get less. We could use discovery API for that.

healthcare data gov cdc
Healthcare COVID

g62h-syeh

Discovery API has publication_date which is different than createdAt

In that healthcare it is earlier

In Chicago 5cd6-ry5g it is later

## Conversion

Wrote an initial version using a for-loop parsing each individual JSON file not via discoveryAPI
Then did a Prefect task version, tested on Chicago data. This spiked CPU usage on the Prefect GraphQL server to 70-80pct.

Probably best approach will be to use discovery API, do initial request for 1 doc, get total number, then map over based on number of "pages" to request by a page_size Prefect parameter.

Then for each page, write to a JSON doc, run the conversion to Typesense format JSON-lines, probably write, and also submit to typesense.

If it has many datasets, eg >10k, and page size is 1k, then Prefect might send out 10 large reqs at once.

Lets just try to start and see what kinds of errors get.

Then we will have an option to sort datasets by most recent, and persist some last_fetched_at date somewhere with Prefect or manually, and only request datasets that changed since then.

Also, we may not need to persist as much as I am right now.