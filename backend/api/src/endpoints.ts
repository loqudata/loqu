export const Endpoints = {
  WIKIDATA: "https://query.wikidata.org/bigdata/namespace/wdq/sparql",
  LOQU: process.env.LOQU_SPARQL_ENDPOINT || "http://localhost:8890/sparql",
};
