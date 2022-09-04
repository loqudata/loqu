import { sparqlQuery } from "./sparql";

import { Endpoints } from "./endpoints";
import { getDatasets } from "./datasets";
import { BasicCountry } from "./countries";

export async function getCountryByISO(
  countryISO: string
): Promise<BasicCountry | undefined> {
  const wikiDataQuery = `
      PREFIX wd: <http://www.wikidata.org/entity/>
      PREFIX wdt: <http://www.wikidata.org/prop/direct/>
      
      SELECT * WHERE {
          ?country wdt:P298 "${countryISO}";
            rdfs:label ?label.
          FILTER(lang(?label) = 'en')
          OPTIONAL {
              ?country wdt:P163 ?flag .
              OPTIONAL { ?flag wdt:P18 ?flagURI. }
              OPTIONAL { ?flag wdt:P487 ?flagChar. }
          }
      }
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
      iso: countryISO,
      flag: bindings["flagURI"] ? bindings["flagURI"].value : undefined,
      flagChar: bindings["flagChar"] ? bindings["flagChar"].value : undefined,
    }));

    if (wikiDataOut.length !== 1) {
      console.warn(`Request had getCountry result not equal to 1`);
      return;
    } else {
      return wikiDataOut[0];
    }
  } catch (err) {
    throw err;
  }
}

export async function getCountryDatasetsByISO(countryISO: string) {
  const linkedEntity = (await getCountryByISO(countryISO))?.iri;
  if (!linkedEntity) return;
  return await getDatasets(linkedEntity);
}
