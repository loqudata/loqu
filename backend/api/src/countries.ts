import { sparqlQuery } from "./sparql";

import { Endpoints } from "./endpoints";

export interface BasicCountry {
  iri: string;
  name: string;
  // description: string
  iso?: string;
  flag?: string;
  flagChar?: string;
  numSeries?: number;
}

// TODO: think about INTL
// TODO: maybe make this CONSTRUCT to return JSON-LD
export async function getCountries(
  countries: WithCounts[]
): Promise<BasicCountry[]> {
  const wikiDataQuery = `
    PREFIX wd: <http://www.wikidata.org/entity/>
    PREFIX wdt: <http://www.wikidata.org/prop/direct/>
    
    SELECT ?country
    (SAMPLE(?label) as ?label)
    (SAMPLE(?isoCode) as ?isoCode)
    (SAMPLE(?flagURI) as ?flagURI)
    (SAMPLE(?flagChar) as ?flagChar) WHERE {
        VALUES ?country { ${countries
          // .slice(0, 10)
          .map(c => "<" + c.iri + ">")
          .join(" ")} }
        ?country wdt:P298 ?isoCode;
          rdfs:label ?label.
        FILTER(lang(?label) = 'en')
        OPTIONAL {
            ?country wdt:P163 ?flag .
            OPTIONAL { ?flag wdt:P18 ?flagURI. }
            OPTIONAL { ?flag wdt:P487 ?flagChar. }
        }
    } GROUP BY ?country
    # LIMIT 10
    `;

  try {
    const wd = await sparqlQuery(
      Endpoints.WIKIDATA,
      wikiDataQuery,
      "select",
      "postDirect"
    );
    const wikiDataOut = wd.map(bindings => ({
      iri: bindings["country"].value,
      name: bindings["label"].value,
      iso: bindings["isoCode"].value,
      flag: bindings["flagURI"].value,
      flagChar: bindings["flagChar"] ? bindings["flagChar"].value : undefined,
      numSeries: countries.filter(s => s.iri == bindings["country"].value)[0]
        .numSeries,
      numDataset: countries.filter(s => s.iri == bindings["country"].value)[0]
        .numDataset,
    }));

    return wikiDataOut;
  } catch (err) {
    throw err;
  }
}

interface WithCounts {
  iri: string;
  numSeries: number;
  numDataset: number;
}

/** This is the long/resource-intensive query */
export async function getAllCountries(): Promise<WithCounts[]> {
  const query = `
  SELECT
  ?external
  (SUM(?series) as ?numSeries)
  (COUNT(?dataset) as ?numDataset)
  WHERE {
    ?codeValue skos:exactMatch ?external .
    ?c qb:dimension ?d.
    ?d qb:codeList ?cl. 
    ?cl skos:hasTopConcept ?codeValue . 
  
    ?dataset qb:component ?c.
    ?dataset lqo:nb_series ?series .
  }
  GROUP BY ?external
  ORDER BY DESC(?numSeries)`;
  try {
    const out = await sparqlQuery(Endpoints.LOQU, query);

    return out.map(bindings => ({
      iri: bindings["external"].value,
      numSeries: parseInt(bindings["numSeries"].value, 10),
      numDataset: parseInt(bindings["numDataset"].value, 10),
    }));
  } catch (err) {
    throw err;
  }
}

/** We're including the wikidata just to make sure the client doesn't need another request. */
export async function getEnrichedCountries() {
  try {
    const countryIRIs = await getAllCountries();

    const out = await getCountries(countryIRIs);
    return out;
  } catch (error) {
    throw error;
  }
}
