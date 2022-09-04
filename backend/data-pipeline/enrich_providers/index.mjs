import { readFileSync } from "fs";
import fetch from "node-fetch";

const DBNOMICS_PROVIDERS = "https://api.db.nomics.world/v22/providers";

const WIKIDATA_FUZZY_SEARCH =
  "https://www.wikidata.org/w/api.php?action=query&list=search&format=json&srsearch=";
const WIKIDATA_REGULAR_SEARCH =
  "https://www.wikidata.org/w/api.php?action=wbsearchentities&format=json&language=en&type=item&continue=0&search=";

class SPARQLQueryDispatcher {
  constructor(endpoint) {
    this.endpoint = endpoint;
  }

  query(sparqlQuery) {
    const fullUrl = this.endpoint + "?query=" + encodeURIComponent(sparqlQuery);
    const headers = { Accept: "application/sparql-results+json" };

    return fetch(fullUrl, { headers })
      .then((body) => body.json())
      .catch((e) => console.error(e));
  }
}

const endpointUrl = "https://query.wikidata.org/sparql";
const queryDispatcher = new SPARQLQueryDispatcher(endpointUrl);

const makeSparqlQuery = (qid) => `
SELECT ?image ?description
WHERE 
{
  OPTIONAL { wd:${qid} wdt:P154 ?image . }
  OPTIONAL { wd:${qid} schema:description ?description . }
  
  FILTER ( lang(?description) = "en" )
}`;

const do_enrich = async (original, fuzzy = false) => {
  const resp = await (
    await fetch(
      fuzzy ? WIKIDATA_FUZZY_SEARCH : WIKIDATA_REGULAR_SEARCH + original.name
    )
  ).json();
  const item = fuzzy ? resp.query.search[0] : resp.search[0];
  if (!item) return original;
  const qid = item.title;
  original.wikidataID = qid;
  original.wikidataDescription = item.snippet;
  const sparqlResp = await queryDispatcher.query(makeSparqlQuery(qid));
  if (sparqlResp && sparqlResp.results.bindings[0]) {
    const res = sparqlResp.results.bindings[0];
    original.logoImage = res.image?.value;
    original.description = res.description?.value;
  }
  return original;
};

const get_providers = (fetch = false) => {
  const r = readFileSync("./providers.json", "utf-8").toString();
  const data = JSON.parse(r);
  return data;
};

const iterate = () => {
  const data = get_providers();
  let workers = [];
  for (let provider of data.providers.docs) {
    workers.push(do_enrich(provider));
  }
  return Promise.all(workers);
};

console.log(JSON.stringify(await iterate()));

// fetch(DBNOMICS_PROVIDERS)
// .then(response => response.json())
// // Turns the response in an array of simplified entities
// .then((data) => {
// })
