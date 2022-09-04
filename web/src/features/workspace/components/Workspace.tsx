import { Box, Text } from "@chakra-ui/react";
import {
  IJsonModel,
  Layout,
  Model,
  TabNode,
  TabSetNode,
} from "flexlayout-react";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store/store";

import "flexlayout-react/style/light.css";
import "./workspace.css"

import { ChartForm, MainChart } from "features/chartEditor/components/ChartForm";
import { DataSelector } from "features/selectData/components/DataSelector";
import { SQLEditor } from "features/sqlEditor/components/SQLEditor";
import { TableGrid } from "features/sqlEditor/components/TableGrid";
import { ConnectedFields, Fields } from "features/workspaceCharts/components/Fields";
import { RecommendedCharts } from "features/visualization/components/RecommendedCharts";

const ComponentsMap: Record<string, React.ComponentType<{ node: TabNode } & any>> = {
  button: ({ node }) => <button>{node.getName()}</button>,
  fields: ConnectedFields,
  sqlEditor: SQLEditor,
  selectData: DataSelector,
  tableGrid: TableGrid,
  chartEditor: ChartForm,
  recommendedCharts: RecommendedCharts,
  mainChart: MainChart
};

export const Workspace = () => {
  // const [model, setModel] = useState(Model.fromJson(initialModel));
  const modelData = useSelector<RootState>(
    (state) => state.workspace.modelJSON
  ) as IJsonModel;
  const model = Model.fromJson(modelData);
  const dispatch = useDispatch();

  function factory(node: TabNode) {
    var component = node.getComponent();
    const Rend = ComponentsMap[component];
    if (!Rend) {
      return <Text>Error, couldn't find component of type {component}.</Text>;
    } else {
      return <Rend node={node} standalone></Rend>;
    }
  }
  return (
    <Box minH="100vh" minW="100vw">
      <Layout
        factory={factory}
        model={model}
        onModelChange={(p) => dispatch.workspace.setModel(p.toJson())}
      ></Layout>
    </Box>
  );
};
