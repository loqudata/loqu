# Log

## Tue 08 Feb 2022 03:30:11 PM EST

Started working on datasets/backend again.

Got list of portals from Open Data Portal Watch API

Made HTTP reqs to the api search endpoint, and added up the total numbers for 911,542 datasets.
Plus, could be more, because for example the Hamburg transparency portal (http://suche.transparenz.hamburg.de) lists 7000 datasets via API but shows >100k on website.

## Wed 09 Feb 2022 04:28:50 PM EST

Compared NocoDB and Baserow:

Pros and Cons
- Baserow has a more expansive API, especially for table field metadata/schema. So could potentially allow you to dynamically create fields, eg other import systems. NocoDB doesn't have this API yet, but metadata APIs are [on the roadmap](https://github.com/nocodb/nocodb/issues/457). But NocoDB does have a GraphQL API that Baserow doesn't have.
- You can't request more than 100 records at a time in Baserow via the API, but [you can with NocoDB](https://github.com/nocodb/nocodb/discussions/900). It's on [Baserow's roadmap to fix](https://gitlab.com/bramw/baserow/-/issues/436).
- Both their import from a file features are a bit confusing; they happen at the Database/Project level. So you can't create a new Table under your DB/Project from an import. I think this is based off of Airtable, but I'd like to see this improved.
- None of them have undo/redo support or multi-select fields like a spreadsheet, but those are on the roadmap.
- NocoDB handles converting between column/field types better (at least with the Single-select to Text that I tried, it preserved data). Baserow had an issue converting from Text to Single-select, lost data, and couldn't convert back.
- I'd like to see an option to copy a Table to try out a potentially destructive action because both of these softwares are in a kind of beta state.

## Thursday

JSON-server has PATCH reqs.

<!-- kinda unrelated -->

What want to do: build a no-code database interface alternative to Noco and Baserow.
- Built for production: concurrency control
- Convenient undo/redo runs reliable database migrations underneath

Postgrest has good Patch support. Implement OCC

Use Glide for a spreadsheet on top

Use Liquibase for db-native undo/redo and migrations: https://docs.liquibase.com/workflows/liquibase-community/liquibase-auto-rollback.html

To think about: make more generic for operating on Parquet/Delta Lake (maybe this preserves past data and transforms better)
Could make MVP with DuckDB, SQL generation in browser for loading data, filtering, i guess even updates
(liqbase would have to be server, java)

<!-- end-unrelated -->

Because I do want a data transform layer to loqu
- track history of all transforms locally, click to go back - maybe should be cherry-pickable or tree history
- how to deal with duckdb? for UPDATE or DROP, shouldn't use, update our own in-memory overlay data structure and column info.
Deal with the following complications after the first part MVP:
- what about things like change column type, where we need that new representation to run a query? well duckdb has fleixble/non strict typing; investigate if helpful
- otherwise, would we need some migrations/rollback features? maybe look at the Liquibase code and make a lightweight port to JS/TS?

Just build an app DB and the Prefect scraper
Later, a UI, or use nocode like Tooljet for it.

Forget thinking about:
the loqu data modify system, SQL UPDATE & HTTP POST/PATCH, Temporal tables

Use NocoDB. Build it.

Late Thursday:

CKAN Scraper working OK
Took about 28 minutes to download 600k datasets
23:12 - 23:30 (50 - italy base-dati is still going; OK now ended at 00:43)
An extra hour and 13 mins for Italy - maybe just particularly slow server.

Strategy
For Europe, scrape from `data.europa.eu` if it is not markedly slow. They have several APIs - CKAN and JSON-LD documents which have translations of title and description into all EU languages, which would save on cloud translation costs later for allowing search in native lang.

Also, then fetch lists of data portals from:
- OpenDataMonitor
- civictech.guide/

some portals in OpenDataMonitor are not in European Data Portal (eg 7 vs 2 for UK), so there's local data left on the table.
Try to read either of the project's scrapers to compare if are more robust then ours.

Want reports with errors so can debug individual portals. Hard to read in a log that has a bunch of other stuff - maybe get rid of iteration counts, only on done (ideal), but easiest with Task structure on start.

Potential Optimizations:
Test different page limits to maximize throughput
Request 5 reqs of each portal to calculate latency/throughput and then prioritize the slower ones to start early on a worker and continue through the rest of the process -- so there isn't one portal which started near the end that lags on for a long time.

Search:
11GB is too much to store/search in memory, at least with our price constraints. Quickwit or lambda or a similar solution it is!

Conclusion of Download:
`wc -l *.jsonl > count3.txt`: `/mnt/data/prefect/ckan/count3.txt`
`1102750 total`. 1,102,750

The NocoDB SQL query indicated that those portals have 1,121,842 datasets. Missing 19,092.

## Creating Portal IDs

We'd like to have relatively stable identifiers for open data portals. Sometimes a portal operated by the same institution will change domain or base url on a domain. Once we setup our data infrastructure we'll ingest the portals and create ULIDs, and perhaps shortcodes that are meant to be stable. 

At the same time we also need a portal ID that **is different** if the API endpoint changes.

Because potentially a domain can have multiple portals at different base urls, to normalize and create an **ID based on the API endpoint**, we remove the protocol (eg `https://`), and then replace all dots and slashes with underscores. This means a API endpoint like `https://www.betaavoindata.fi/data/fi` would become `www_betaavoindata_fi_data_fi`.

TODO: make a note of any redirects, e.g. from the non-www version of that URL to the www version.