import React from "react";

import { AgGridColumn, AgGridReact } from "ag-grid-react";

import "ag-grid-community/dist/styles/ag-grid.css";
// or alpine
import "ag-grid-community/dist/styles/ag-theme-balham.css";

import "./grid.css"

import { Box, Flex, Text } from "@chakra-ui/react";

import defaultData from "data/cars.json"

export const CoreGrid = ({
  rowData = defaultData,
  columns = Object.keys(defaultData[0]),
}: {
  rowData?: any;
  columns?: string[];
}) => {
  // TODO(perf): seems to re-render a lot
  // console.log(rowData);
  
  return (

    <Flex direction="column" h="full">
        {/* <Box > */}
            <Box className="ag-theme-balham" w="full" flexGrow={1}  fontFamily="Inter !important">
              <AgGridReact rowData={rowData} defaultColDef={{resizable: true, filter: true}}>
                {columns.map((c) => (
                  <AgGridColumn key={c} field={c}></AgGridColumn>
                ))}
              </AgGridReact>
            </Box>
        {/* </Box> */}
        <Box p={2}>
            <Text fontSize="xs" fontWeight="semibold" color="gray.600">{rowData.length} rows, {columns.length} columns.</Text>
        </Box>
    </Flex>
  );
};
