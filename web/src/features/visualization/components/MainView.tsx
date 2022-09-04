import { Flex, Stack } from "@chakra-ui/react";
import React from "react";
import { ChartForm, ChartFormWithPlot } from "features/chartEditor/components/ChartForm";
import { RecommendedCharts } from "./RecommendedCharts";


export const MainView = () => {
  return (
    <Stack flexShrink={1} p={4} spacing={4} w="full">
      <Flex
        borderRadius="lg"
        minH={20}
        h="full"
        maxH="70vh"
      >
        <ChartFormWithPlot />
      </Flex>
      <RecommendedCharts/>
    </Stack>
  );
};
