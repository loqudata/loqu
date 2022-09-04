import { createModel, RematchDispatch } from "@rematch/core";
import { RootModel } from "./index";

import { FieldSchema, Schema } from "compassql/build/src/schema";
import {
  Data,
  InlineData,
  isInlineData,
  isUrlData,
} from "vega-lite/build/src/data";
import { isArray } from "lodash";
import { AppConfig } from "./config";
import { fetchCompassQLBuildSchema } from "../api/api";

export interface DatasetWithoutSchema {
  isLoading: boolean;

  name: string;

  data: InlineData;
}

export interface Dataset extends DatasetWithoutSchema {
  schema: Schema;
}

export const DEFAULT_DATASET: Dataset = {
  isLoading: false,
  name: "Empty",
  schema: new Schema({ fields: [] }),
  data: null,
};

interface DatasetLoad {
  name: string;
  data: Data;
}

// Actions
// We don't have action creators because these are internall to the `datasetLoad` thunk
// and are only called in two places
export const DATASET_REQUEST = "DATASET_REQUEST";
export const DATASET_RECEIVE = "DATASET_RECEIVE";

export const DatasetReducer = (
  dataset = DEFAULT_DATASET,
  { payload, type }
) => {
  switch (type) {
    case DATASET_REQUEST:
      return {
        ...dataset,
        isLoading: true,
      };
    case DATASET_RECEIVE:
      const { name, data, schema } = payload;
      return {
        ...dataset,
        isLoading: false,
        name,
        schema,
        data,
      };
    default:
      return dataset;
  }
};

/**
 * datasetLoad makes HTTP requests to data location, parses it and creates table schema.
 * it emits dataset.request which sets the state to loading
 * then emits dataset.receive on completion to merge data and turn off loading
 * It's a thunk
 */
 export const datasetLoad = (payload: DatasetLoad): any => async (dispatch, getState) => {
  // console.log(payload, state);
  const state = getState()

  // console.log("This is current root state", state);
  const { name, data } = payload;
  dispatch({ type: DATASET_REQUEST });

  if (isUrlData(data)) {
    return fetch(data.url)
      .then((response) => response.json())
      .then((values: any) => {
        return buildSchemaAndDispatchDataReceive(
          { values },
          state.config,
          dispatch,
          name
        );
      })
      .catch((e) => console.error(e));
  } else if (isInlineData(data)) {
    return buildSchemaAndDispatchDataReceive(
      data,
      state.config,
      dispatch,
      name
    );
  } else {
    throw new Error("dataset load error: dataset type not detected");
  }
}

export function buildSchemaAndDispatchDataReceive(
  data: InlineData,
  config: AppConfig,
  dispatch: any,
  name: string
) {
  if (!isArray(data.values)) {
    throw new Error("Voyager only supports array values");
  }
  return fetchCompassQLBuildSchema(data.values, config).then((schema) => {
    dispatch({ type: DATASET_RECEIVE, payload: { name, schema, data, isLoading: false }});
  });
}
