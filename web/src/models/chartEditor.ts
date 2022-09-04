import { createModel } from "@rematch/core";
import type { RootModel } from "./index";

import { isString } from "vega";
import { Field, FieldDef } from "vega-lite/build/src/channeldef";
import { Encoding } from "vega-lite/build/src/encoding";
import { Mark } from "vega-lite/build/src/mark";
import { Type } from "vega-lite/build/src/type";

export type FormEncodingKeys = "x" | "y" | "color" | "shape" | "size";
export type FieldID = string;

export type IField = FieldDef<FieldID, Type>;

export interface FormState extends Pick<Encoding<FieldID>, FormEncodingKeys> {
  mark: Mark;
  tooltip: { enabled: boolean; allFields: boolean };

  /** A boolean for each of encoding keys that indicates if the details view (dropdown) is open */
  formDetails: FormDetailsState;
}

type FormDetailsState = Partial<{
  [key in FormEncodingKeys]: boolean;
}>;

const initialState: FormState = {
  mark: "bar",
  tooltip: { enabled: true, allFields: false },
  formDetails: {},
};

export interface SetEncodingFieldArgs {
  encodingKey: FormEncodingKeys;
  field: IField | string;
}

export const chartEditor = createModel<RootModel>()({
  state: initialState,
  reducers: {
    setEncodingField: (state, payload: SetEncodingFieldArgs) => {
      let f: IField;
      if (isString(payload.field)) {
        f = { field: payload.field };
      } else {
        f = payload.field;
      }
      state[payload.encodingKey] = f;
    },
    setMark: (state, payload: Mark) => {
      state.mark = payload;
    },

    setTooltip: (state, payload: boolean) => {
      state.tooltip.enabled = payload;
    },

    setTooltipAllFields: (state, payload: boolean) => {
      state.tooltip.allFields = payload;
    },

    toggleDetailView: (state, payload: FormEncodingKeys) => {
      console.log(state, payload);

      state.formDetails[payload] = !state.formDetails[payload];
    },
    mergeState: (state, payload: any) => {
      return Object.assign({}, state, payload)
    }
  },
  // Didn't have this before, was causing TS issue
  effects: (dispatch) => ({

    /** Takes the result recommendation number to add */
    addRecommendationToMainView: (payload: number, rootState) => {
      // TODO: make type safe, also is this robust?
      const recommendation = rootState.result.plots[payload].spec as any
      // const oldFormState = rootState.chartEditor
      const newFormState = {
        mark: recommendation.mark,
        ...recommendation.encoding
      }
      dispatch.chartEditor.mergeState(newFormState)
    }
  })
});


