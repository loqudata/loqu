import SparqlClient from "sparql-http-client/ParsingClient";
import { ResultRow } from "sparql-http-client/ResultParser";
import { Quad } from "rdf-js";
import { VERSION } from "./version";

export const commonPrefixes = `
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX qb: <http://purl.org/linked-data/cube#>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX lq: <https://loqudata.org/>
PREFIX lqo: <https://ontology.loqudata.org/>
`;

/** This does a SPARQL query with the provided options. It doesn't stream */
export async function sparqlQuery<T extends "select" | "construct" = "select">(
  endpoint: string,
  query: string,
  queryType: T = "select" as any,
  operation: "get" | "postUrlencoded" | "postDirect" = "get"
): Promise<T extends "select" ? ResultRow[] : Quad[]> {
  const client = new SparqlClient({ endpointUrl: endpoint, headers: {
    "User-Agent": `LoquAPI/${VERSION} (https://github.com/loqudata/api) sparql-http-client/2.3`
  } });

  return client.query[queryType](commonPrefixes + query, {
    operation,
  }) as any;
}
