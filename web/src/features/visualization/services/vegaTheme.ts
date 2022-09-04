import { Config as VgConfig } from "vega";
import { Config as VlConfig } from "vega-lite";
import { theme } from "../../../shared/theme";

export type Config = VgConfig | VlConfig;

// console.log("THEME",theme);

const markColor = theme.colors.primary["600"];

const vegaTheme: Config = {
  background: "#fff",
  font: "Inter",

  // mark: {fill: markColor},

  // // it seems like the mark fill was being merged before the null
  // line: {fill: null, stroke: markColor, strokeWidth: 2},
  // arc: {fill: markColor},
  // area: {fill: markColor},
  // path: {stroke: markColor},
  // rect: {fill: markColor},
  // shape: {stroke: markColor},
  // symbol: {fill: markColor, strokeWidth: 1.5, size: 50},

  // axis: {
  //   bandPosition: 0.5,
  //   grid: true,
  //   gridColor: '#000000',
  //   gridOpacity: 1,
  //   gridWidth: 0.5,
  //   labelPadding: 10,
  //   tickSize: 5,
  //   tickWidth: 0.5,
  // },

  // axisBand: {
  //   grid: false,
  //   tickExtra: true,
  // },

  // TODO: evaluate rest of these
  legend: {
    labelBaseline: "middle",
    labelFontSize: 11,
    symbolSize: 50,
    symbolType: "square",
  },

  // range: {
  //   category: [
  //     '#4572a7',
  //     '#aa4643',
  //     '#8aa453',
  //     '#71598e',
  //     '#4598ae',
  //     '#d98445',
  //     '#94aace',
  //     '#d09393',
  //     '#b9cc98',
  //     '#a99cbc',
  //   ],
  // },
};

export default vegaTheme;
