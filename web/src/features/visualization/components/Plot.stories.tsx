import { Plot } from "./Plot";

import data from "data/cars.json";
import React from "react";

const examplePlot = {
  fieldInfos: [
    {
      fieldDef: {
        field: "Cylinders",
        type: "nominal",
      },
      isEnumeratedWildcardField: true,
    },
    {
      fieldDef: {
        fn: "count",
        field: "*",
        type: "quantitative",
      },
      isEnumeratedWildcardField: false,
    },
  ],
  spec: {
    data: {
      name: "source",
    },
    mark: "bar",
    encoding: {
      y: {
        field: "Cylinders",
        type: "nominal",
      },
      x: {
        aggregate: "count",
        field: "*",
        type: "quantitative",
      },
    },
    config: {
      line: {
        point: true,
      },
      scale: {
        useUnaggregatedDomain: true,
      },
    },
  },
};

export default {
  title: "Basic Plot Example",
  component: Plot,
};

export const SimpleStory = () => (
  <Plot plot={examplePlot as any} data={{ values: data }} schema={{fieldSchemas: []} as any} />
);
