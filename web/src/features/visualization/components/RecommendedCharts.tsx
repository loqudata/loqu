import React from "react";
import { Box, Heading, SimpleGrid } from "@chakra-ui/react";

import { useAppSelector } from "hooks";
import { selectData, selectSchema } from "selectors/index";
import { Result } from "models/result";

import { Plot } from "./Plot";
import { IWorkspacePanelComponentProps } from "models/workspace";

export const RecommendedCharts = ({standalone}: IWorkspacePanelComponentProps) => {
  const result: Result = useAppSelector((state) => state.result);
  const data = useAppSelector(selectData);
  const schema = useAppSelector(selectSchema);
  return (
    <Box p={standalone ? 4 : null}>
      <Heading size="md">
        Recommended Charts ({(result.plots && result.plots.length) || 0})
      </Heading>

      <SimpleGrid columns={[1, 1, 2, 2, 3]} spacing={[2, 3]}>
        {result.plots &&
          data &&
          result.plots
            // .filter(filterPlots(schema))
            // .slice(0, 3)
            .map((plot, i) => (
              <Plot
                idx={i}
                key={JSON.stringify(plot.fieldInfos)}
                plot={plot}
                data={data}
                schema={schema}
              ></Plot>
            ))}
      </SimpleGrid>
    </Box>
  );
};
