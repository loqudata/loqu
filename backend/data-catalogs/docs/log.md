# Loqu Backend Work

Sources of data portals:
1. Very good source: is the Socrata discovery API
2. DataCatalogs.org - not as good, often out of date, but has more info eg real-world location
3. Cyberspace search engine like Zoomeye or Shodan
   1. did this for CKAN -- many sites are test ones or have 0-5 datasets, or are unofficial. Also an issue of getting the domain name from it.
4. Or regular search engine with keywords like location and portal software

Think about using mechanical turk to enrich this stuff.

We have this data structure of a table or a bunch of JSON records for the data portals.

We have some bits of code we want to run to get the status and check various APIs.

We also want to allow some human editing of this data to update the portal URLs manually, maybe curate descriptions, check over location info, etc.

## Things we compute

- Is it up? or does the main URL responds successfully to HTTP request?
- What software is it
  - Does the text for portal software appear in the HTML for the main page
  - Can we access certain routes (eg for CKAN and Socrata)
- How many datasets!!


Eventually, we want to minimize the data required so its easier for the user.