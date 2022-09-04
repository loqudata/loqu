import express from "express";
import { getEnrichedCountries } from "./countries";
import { getDatasets } from "./datasets";
import { getCountryByISO, getCountryDatasetsByISO } from "./countryDatasets";

import helmet from "helmet";

import cors from "cors";

import isDocker from "is-docker";

if (isDocker() && !process.env.LOQU_SPARQL_ENDPOINT) {
  throw new Error("No SPARQL endpoint provided");
}

const app = express();

app.use(helmet());
app.use(cors());

const APP_NAME = "Loqu API";
const VERSION = "0.1.0";

app.get("/version", (_, res) => {
  res.send(APP_NAME + " v" + VERSION);
});

app.get("/countries", async (_, res, next) => {
  try {
    const out = await getEnrichedCountries();

    res.send(out);
  } catch (error) {
    next(error);
  }
});

app.get("/countries/:iso", async (req, res, next) => {
  try {
    const out = await getCountryByISO(req.params.iso);

    if (!out) {
      res.header(400);
    }

    res.send(out);
  } catch (error) {
    next(error);
  }
});

// Same as `/entity/:iri/datasets` where IRI is Wikidata IRI of country ISO
app.get("/countries/:iso/datasets", async (req, res, next) => {
  try {
    const out = await getCountryDatasetsByISO(req.params.iso);

    if (!out) {
      res.header(400);
    }

    res.send(out);
  } catch (error) {
    next(error);
  }
});

app.get("/entity/:iri/datasets", async (req, res, next) => {
  try {
    const out = await getDatasets(req.params.iri);
    res.contentType("application/ld+json");
    res.send(out);
  } catch (error) {
    next(error)
  }
});

const PORT = process.env.PORT || 7000;

app.listen(PORT);
console.log("Listening on", PORT);
