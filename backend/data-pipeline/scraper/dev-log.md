## Issues

- Seems that the first version downloaded 10x less than the actual amount. Could this be an issue with paging? For example, only DLed 137 Eurostat datasets

Solutions:
- Remove paging and set a high limit (e.g. 10,000). Would this overload server? Nope: maximum limit is 500

Running getDatasets for Eurostat in test mode bumped it to 187.

Maybe its a gorountine error (could waitgroup be mixed up?)

A second run, wait a while, interrupt: no logs

After investigation:

- Seems to be duplicating many datasets (found with `sort`)
- Also seems to only request the first page (500) of datasets (which matches the 515 on disk)
### Next version

OK LOL: ls -l total is not the number of files, probably the bytes
Number of files = `ls -l | wc -l` - 1 (the first header line)

WTO - all good

Figured out the issue with the multi-datasets. Offset is the individual number, not calculated on the server side. Thus, we need to multiply our limit by the offset index we want to get the real offset.

Log says: `wrote 6500 out of 6500 datasets to files for provider Eurostat`

Maybe there are identical codes in the responses, so it overwrites the previous version?

CSO, says wrote out 4333


Ok fixed another issue: need to add the datasets from the original request to not skip the first 500.

CSO wrote 4833 and Eurostat 6892, both the right number from the API.

## More ideas for DBNomics

- provide an `seriesNameNormalized` or `defaultSeriesNames` property on each dataset that indicates if the series names are just generated from the names of the keys that identify the series. It could also be `customSeriesNames`
- Provide guidelines on which providers and datasets it will accept, if more contributors join