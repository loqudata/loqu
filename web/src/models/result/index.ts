import { createModel } from "@rematch/core";
import { Query } from "compassql/build/src/query/query";
import { RootModel } from "..";
import { ResultPlot, ResultPlotWithKey } from "./plot";

export * from "./plot";

/** Models: */

export interface Result {
  isLoading: boolean;

  plots: ResultPlot[] | null;

  query: Query;

  limit: number;
}

export interface ResultIndex {
  // This is the result of the query from the shelf
  main: Result;

  addCategoricalField: Result;
  addQuantitativeField: Result;
  addTemporalField: Result;
  alternativeEncodings: Result;
  histograms: Result;
  summaries: Result;
}

export const DEFAULT_RESULT: Result = {
  isLoading: false,
  plots: null,
  query: null,
  limit: 8,
};

export const DEFAULT_RESULT_INDEX: ResultIndex = {
  main: DEFAULT_RESULT,
  addCategoricalField: DEFAULT_RESULT,
  addQuantitativeField: DEFAULT_RESULT,
  addTemporalField: DEFAULT_RESULT,
  alternativeEncodings: DEFAULT_RESULT,
  histograms: DEFAULT_RESULT,
  summaries: DEFAULT_RESULT,
};

export type ResultType = keyof ResultIndex;

export const RESULT_TYPES: ResultType[] =
  // Need to cast as keys return string[] by default
  Object.keys(DEFAULT_RESULT_INDEX) as ResultType[];

import { fetchCompassQLRecommend } from "../../api/api";
// import { ResultType } from "..//result";
import { selectConfig, selectData, selectSchema } from "../../selectors/index";

export type ResultAction = ResultRequest | ResultReceive;

// type ResultActionType = ResultAction["type"];

// const RESULT_ACTION_TYPE_INDEX: { [K in ResultActionType]: 1 } = {
//   RESULT_REQUEST: 1,
//   RESULT_RECEIVE: 1,
//   RESULT_LIMIT_INCREASE: 1,
//   // Result modify actions
//   RESULT_MODIFY_FIELD_PROP: 1,
//   RESULT_MODIFY_NESTED_FIELD_PROP: 1,
// };

export type ResultRequestPayload = {
  resultType: ResultType;
};

export type ResultLimitIncreasePayload = {
  resultType: ResultType;
  increment: number;
};

export type ResultReceivePayload = {
  resultType: ResultType;
  query: Query;
  plots: ResultPlot[];
};

// export const RESULT_MODIFY_FIELD_PROP = 'RESULT_MODIFY_FIELD_PROP';
// export type ResultModifyFieldProp<
//   P extends 'sort' // TODO: stack and format
// > = ReduxAction<typeof RESULT_MODIFY_FIELD_PROP, {
//   resultType: ResultType,
//   index: number,
//   channel: Channel,
//   prop: P
//   value: ShelfFieldDef[P]
// }>;

// export const RESULT_MODIFY_NESTED_FIELD_PROP = 'RESULT_MODIFY_NESTED_FIELD_PROP';
// export type ResultModifyNestedFieldProp<
//   P extends 'scale' | 'axis' | 'legend',
//   N extends keyof ShelfFieldDef[P]
// > = ReduxAction<typeof RESULT_MODIFY_NESTED_FIELD_PROP, {
//   resultType: ResultType,
//   index: number,
//   channel: Channel,
//   prop: P,
//   nestedProp: N,
//   value: ShelfFieldDef[P][N]
// }>;

export const DEFAULT_LIMIT: { [K in ResultType]: number } = {
  main: 12,
  addCategoricalField: 4,
  addQuantitativeField: 4,
  addTemporalField: 2,
  alternativeEncodings: 2,
  summaries: 2,
  histograms: 12,
};

interface ResultRequest {
  resultType: ResultType;
}

interface ResultReceive {
  resultType: ResultType;
  query: Query;
  plots: ResultPlot[];
}

interface ResultRequestAsync {
  resultType: ResultType;
  query: Query;
  filterKey?: string;
}

/**
 * datasetLoad makes HTTP requests to data location, parses it and creates table schema.
 * it emits dataset.request which sets the state to loading
 * then emits dataset.receive on completion to merge data and turn off loading
 */
export const result = createModel<RootModel>()({
  state: DEFAULT_RESULT, // initial state
  reducers: {
    request: (state, payload: ResultRequestPayload) => ({
      ...state,
      isLoading: true,
      plots: undefined,
      query: undefined,
      limit: DEFAULT_LIMIT[payload.resultType],
    }),
    receive: (state, payload: ResultReceivePayload) => {
      const { plots, query } = payload;
      return {
        ...state,
        isLoading: false,
        plots,
        query,
      };
    },
  },
  effects: (dispatch) => ({
    // handle state changes with impure functions.
    // use async/await for async actions

    requestAsync: async (payload: ResultRequestAsync, state) => {
      const schema = selectSchema(state);
      const data = selectData(state);
      const config = selectConfig(state);

      const { resultType, query, filterKey } = payload;
      dispatch.result.request({resultType});
      // state.

      // TODO: pass in config
      return fetchCompassQLRecommend(query, schema, data, config).then(
        (preFilteredPlots: ResultPlotWithKey[]) => {
          const plots: ResultPlot[] = (
            filterKey
              ? preFilteredPlots.filter((p) => p.groupByKey !== filterKey)
              : preFilteredPlots
          ).map((p) => p.plot);

          dispatch.result.receive({ query, plots, resultType });
        }
      );
    },
  }),
});
