import React from "react";

import dynamic from "next/dynamic";

import Layout from "../components/Layout";
import { VisualizePage } from "../features/visualization/components/VisualizePage";
import NoSsr from "../components/NoSsr";
const VisPage = () => (
  <Layout title="Visualize Open Data - Build charts, graphs, and maps">
    <VisualizePage />
  </Layout>
);

// export default VisPage;

const VP = dynamic(() => Promise.resolve(VisPage), {
  ssr: false,
});

export default VP;
