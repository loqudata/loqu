import React from "react";
import { useAppSelector } from "hooks";
import { Box, Center } from "@chakra-ui/react";
import {
  createListOfObjectsArrowProxy,
  getFieldNames,
} from "../services/listOfObjectsArrowProxy";
import { CoreGrid } from "./CoreGrid";
// import { ArrowTableGrid } from "./arrow-viewer/ArrowTableGrid";

// replace with https://github.com/ag-grid/ag-grid
export const TableGrid = () => {
  const data = useAppSelector((s) => s.sqlQuery.data);
  const status = useAppSelector((s) => s.sqlQuery.status);

  // console.log(data, );
  let rowData;
  let columns;
  
  if (data) {
    rowData = createListOfObjectsArrowProxy(data);
    columns = getFieldNames(data);
  }
  // console.log(rowData);

  return status == "completed" ? (
    <CoreGrid rowData={rowData} columns={columns} /> // <ArrowTableGrid table={data} width={300} height={800}></ArrowTableGrid>
  ) : (
    <Center p={2} h="full">
      You haven't run any queries. Run one to view the results here.
    </Center>
  );
};
