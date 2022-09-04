import { responsivePadding } from "shared/theme";
import { Box, Flex } from "@chakra-ui/react";
import React from "react";
import { FieldPanelContainer } from "./FieldPanel";
import { MainView } from "./MainView";

import { NextRouter, useRouter } from "next/router";

export const VisualizePage = () => {
  const rt: NextRouter | null = useRouter();
  const socrata_url =
    rt?.query && rt.query.portal
      ? "https://" + rt.query.portal + "/resource/" + rt.query.id + ".json"
      : undefined;

  return (
    <Flex minH="100vh" w="full" px={responsivePadding} py={1}>
        <FieldPanelContainer ds={socrata_url}></FieldPanelContainer>
        <MainView></MainView>
    </Flex>
  );
};
