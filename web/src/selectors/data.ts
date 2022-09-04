import { Schema } from "compassql/build/src/schema";
import { InlineData } from "vega-lite/build/src/data";
import { Dataset } from "models/dataset";
import { RootState } from "../store/store";

export const selectData = (state: RootState): InlineData => state.dataset.data;
export const selectDataset = (state: RootState): Dataset => state.dataset;
export const selectSchema = (state: RootState): Schema => state.dataset.schema;
