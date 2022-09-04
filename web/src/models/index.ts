import { Models } from "@rematch/core";
import { config } from "./config";
import { shelf } from "./shelf";
import { result } from "./result";
import { sqlQuery } from "./sqlQuery";
import { workspace } from "./workspace";
import { chartEditor } from "./chartEditor";

export interface RootModel extends Models<RootModel> {
  config: typeof config;
  shelf: typeof shelf;
  result: typeof result;
  sqlQuery: typeof sqlQuery;
  workspace: typeof workspace;
  chartEditor: typeof chartEditor;
}

export const models: RootModel = { config, shelf, result, sqlQuery, workspace, chartEditor };
