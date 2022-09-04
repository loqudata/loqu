import {
  Box,
  chakra,
  Flex,
  HStack,
  Image,
  Link,
  Text,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { DataSource, DATA_SOURCES } from "./DataSource";

import duckdb from "assets/duckdb-logo.svg";
import { FileSelector } from "./FileSelector";
import { useSelector } from "react-redux";
import { RootState } from "store/store";
import { IFile } from "utils/serializeableFile";

const fileTypes = ["CSV"];
/* , XLS, JSON, or GeoJSON  */

export const DataSelector = () => {
  const selectedFile = useSelector<RootState>(
    (state) => state.sqlQuery.file
  ) as IFile | null;
  return (
    <VStack h="full" p={2} alignItems="start">
      <Text fontWeight="bold">Choose a data source</Text>
      <VStack
        alignItems="start"
        spacing={4}
        p={4}
        border="1px solid"
        borderColor="gray.300"
        borderRadius="md"
      >
        <Text fontWeight="semibold">Local source</Text>

        <HStack>
          <Text>
            {selectedFile ? (
              <>
                You have selected{" "}
                <Text as={chakra.span} fontWeight="semibold">
                  {selectedFile.name}
                </Text>{" "}
                Choose a different {fileTypes.join(", ")} file:
              </>
            ) : (
              <>Choose a {fileTypes.join(", ")} file:</>
            )}
          </Text>
          <FileSelector />
        </HStack>

        <Flex>
          <Box flexGrow={1} mr={2}>
            <Text maxW="md">
              Your file will be imported to an in-memory database called{" "}
              <Link href="https://duckdb.org/" target="_blank" color="blue.600">
                DuckDB
              </Link> so you can transform and analyze datasets right in
              your browser.
              {/* using our interface. */}
            </Text>
          </Box>

          <Image src={duckdb} maxW={16} />
        </Flex>
      </VStack>
      {/* {DATA_SOURCES.map((d) => (
        <DataSource source={d} />
      ))} */}
    </VStack>
  );
};
