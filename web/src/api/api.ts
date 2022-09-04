/**
 * This file stores API for making request to CompassQL (either within the browser or via the server).
 */

import { Query } from "compassql/build/src/query/query";
import { recommend } from "compassql/build/src/recommend";
import * as s from "compassql/build/src/schema";
const { build } = s;
// import { build as buildSchema, Schema } from "compassql/build/compassql";
// import { build as buildSchema, Schema } from "compassql/build/src/schema";
// import "isomorphic-fetch";
import { Data, InlineData } from "vega-lite/build/src/data";
import { AppConfig } from "models/config";
// import {  ResultPlotWithKey } from "models/result";
// export {Query, Schema, Data};

import { fromSpecQueryModelGroup, ResultPlotWithKey } from "models/result";
import { ISchema } from "./schema";

/**
 * Submit recommendation query request from CompassQL
 */
export function fetchCompassQLRecommend(
  query: Query,
  schema: ISchema,
  data: InlineData,
  config?: AppConfig
): Promise<ResultPlotWithKey[]> {
  if (config && config.serverUrl) {
    const endpoint = "recommend";
    
    return fetch(`${config.serverUrl}/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "same-origin",
      body: JSON.stringify({
        query,
        // fieldSchemas are just JSON
        schema: schema.fieldSchemas,
        data,
      }),
    }).then((response) => {
      return response.json();
    });
  } else {
    return new Promise((resolve) => {
      const modelGroup = recommend(query, schema).result;

      // console.log("RESULTS");

      // console.log(modelGroup);

      const actual = fromSpecQueryModelGroup(modelGroup, { name: "source" });
      // console.log(actual);

      // resolve([])
      // TODO:
      // - replace this with different cached data source's unique names
      // once we have multiple cached data source from Leilani's optimizer engine
      resolve(actual);
    });
  }
}

/**
 * Submit schema building request from CompassQL
 */
export function fetchCompassQLBuildSchema(
  data: Object[],
  config?: AppConfig
): Promise<ISchema> {
  return new Promise((resolve) => {
    const ns = build(data);
    // console.log(ns);
    resolve(ns);
  });
}
