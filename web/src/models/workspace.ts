import { createModel } from "@rematch/core";
import { IJsonModel } from "flexlayout-react";
import type { RootModel } from "./index";

export interface Workspace {
  modelJSON: any;
}

export interface IWorkspacePanelComponentProps {
  standalone?: boolean
}

const initialModel = {
  global: {},
  borders: [],
  layout: {
    type: "row",
    weight: 100,
    children: [
      {
        type: "tabset",
        weight: 10,
        minWidth: 200,
        children: [
          {
            type: "tab",
            name: "Fields",
            component: "fields",
          },
        ],
      },
      {
        type: "row",
        weight: 90,
        children: [
          {
            type: "row",
            weight: 50,
            children: [
              {
                type: "tabset",
                weight: 40,
                children: [
                  {
                    type: "tab",
                    name: "Chart Editor",
                    component: "chartEditor",
                  },
                ],
              },
              {
                type: "tabset",
                weight: 60,
                children: [
                  {
                    type: "tab",
                    name: "View Chart",
                    component: "mainChart",
                  },
                ],
              },
            ],
          },
          {
            type: "tabset",
            weight: 30,
            children: [
              {
                type: "tab",
                name: "Recommended Charts",
                component: "recommendedCharts",
              },
            ],
          },
          {
            type: "tabset",
            weight: 30,
            children: [
              {
                type: "tab",
                enableClose: false,
                name: "SQL Editor",
                component: "sqlEditor",
              },
              {
                type: "tab",
                enableClose: false,
                name: "Data Selector",
                component: "selectData",
              },
              {
                type: "tab",
                enableClose: false,
                name: "Table View",
                component: "tableGrid",
              },
            ],
          }
        ],
      },
    ],
  },
} as IJsonModel;

export const workspace = createModel<RootModel>()({
  state: { modelJSON: initialModel } as Workspace,
  reducers: {
    setModel(state, payload) {
      state.modelJSON = payload;
    },
  },
});
