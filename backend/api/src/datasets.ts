import { Endpoints } from "./endpoints";

import { sparqlQuery } from "./sparql";

import jsonld from "jsonld";

// TODO: figure out pagination if necessary
export async function getDatasets(linkedEntity: string) {
  const query = `
  CONSTRUCT {
    ?dataset rdfs:label ?label;
            lqo:code ?code;
            lqo:nb_series ?series.
  }
  WHERE {
    ?dataset rdfs:label ?label;
            lqo:code ?code;
            lqo:nb_series ?series.
    {
      SELECT DISTINCT ?dataset WHERE {
        ?codeValue skos:exactMatch <${linkedEntity}> .
        ?c qb:dimension ?d.
        ?d qb:codeList ?cl. 
        ?cl skos:hasTopConcept ?codeValue . 
      
        ?dataset qb:component ?c.
      }
    }
  }
  LIMIT 10
  `;
  try {
    const out = await sparqlQuery(Endpoints.LOQU, query, "construct");
    const context = {
      lqo: "https://ontology.loqudata.org/",
      rdfs: "http://www.w3.org/2000/01/rdf-schema#",
      xsd: "http://www.w3.org/2001/XMLSchema#",
      label: "rdfs:label",
      code: "lqo:code",
      numSeries: { "@id": "lqo:nb_series", "@type": "xsd:integer" },
      datasetLinks: "lqo:datasetLinks",
    };

    const jl = await jsonld.fromRDF(out);

    const comp = await jsonld.compact(jl, context);

    // TODO: this is a bit hacky, a better way?
    const g = comp["@graph"];
    delete comp["@graph"];

    comp["@id"] = linkedEntity;
    comp["@type"] = "lqo:ExternalEntity";
    comp["datasetLinks"] = g;

    return comp;
  } catch (err) {
    throw err;
  }
}
