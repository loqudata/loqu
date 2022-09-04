# TODOs

## Meta

- [ ] better habit of writing conventional commits
- [ ] generate a changelog
- [ ] deploy more frequently, eg after 3 good changes (eg looking at prod loqu for example datasets shows extra vertical spacing for `Field`s and no tooltip on `Plot` hover)
- [ ] have github status show deploy info

## Search

- [ ] fix external link icon
- [ ] fix issue where typing in searchbox doesn't work because tries to update and read query paramater

## Chart editor

- [ ] Improve month/time https://loqudata.org/visualize?id=q6y2-66pb&portal=internal.chattadata.org
- [ ] Fix extents
- [ ] Make the none option only visible if something is selected (eg not placeholder)
- [x] Better visualize page with new fields, integrate chart editor into existing visualize page
- [x] Start working on large dataset using SQL/DuckDB, integrate chart editor into Workspace

## Recommendations

- [ ] Make the main field name more prominent, probably not in a pill, or big and without pill, and get rid of large Fields heading
- [x] Move data into regular Redux so Vega/CompassQL can mutate - add Symbols to it, get CSQL working
- [x] Implement the Show in/Add to Chart Editor

## Field View

- [ ] Add little pill buttons to sort by type: nominal, quantitative, temporal, etc.

## Data loading

Socrata:
- [ ] Show errors loading data from Socrata web service
- [ ] test data for empty list/object, and show an error, and test if resource is simply a chart on another dataset? - https://loqudata.org/visualize?id=uz48-wg52&portal=data.pa.gov, https://data.pa.gov/resource/uz48-wg52.json?$select=*, https://data.pa.gov/Opioid-Related/Annual-Rate-of-Newly-Diagnosed-Cases-of-Hepatitis-/uz48-wg52
- [ ] test if it's resource is from internal Socrata instance and ignore - https://loqudata.org/visualize?id=hc2p-bbis&portal=covid19response.buffalony.gov, https://covid19response.buffalony.gov/d/hc2p-bbis
- [ ] Check to make sure is tabular data file/JSON we can request
- [ ] Determine if is a link to another data portal type we support (eg ArcGIS Hub) https://data.austintexas.gov/Health-and-Community-Services/Confirmed-COVID-Demographics/rqqk-ef3x

File: 
- [ ] improve Data Loader - rename table associated with file (maybe just create a view, but then needs to use real table name for any edit operations - explain limitation on SQL page)
- [ ] integrate into simple visualize page? is it even worth loading DuckDB if we just select limited out, probably not

## Overall App

- [ ] Allow user to view fields, recommendations, and chart editor for different datasets. Open multiple of same type for diff DS? How important is this?
- [ ] Some visual join editor to show two input tables and output, then use the output as visualization
- [ ] At least, show the fields/recommendations for SQL output so can visualize joined data

don't worry about scalability right now, pushing down Vega aggregations or Compassql statistics. Focus on join features.


General areas of focus:

- More data - integrate search for 1.2m CKAN, figure out DBNomics, (later) fix bugs with Socrata loader
- better visualizations - recommendations
- example visualizations/user stories
- Allow users to share vis
- and Edit metadata!! - tool to import/detect from PDFs etc.
- join datasets
- workspace/multiple datasets?
- geographic vis