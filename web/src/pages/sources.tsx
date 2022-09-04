import React from "react";
import { DataSourcePage } from "../features/dataSources/components/DataSourcePage";
import Layout from "../components/Layout";

const IndexPage = () => (
  <Layout title="Data Sources">
    <DataSourcePage></DataSourcePage>
  </Layout>
);

export default IndexPage;
