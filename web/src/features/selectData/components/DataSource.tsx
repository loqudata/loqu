import { Box, Flex, HStack, Icon, Image, Text, VStack } from "@chakra-ui/react";
import React from "react";

import duckdb from "assets/duckdb-logo.svg";

interface IDataSource {
  name: string;
  logo?: any;
}

export const DATA_SOURCES: IDataSource[] = [
  {
    name: "DuckDB",
    logo: duckdb,
  },
];

export const DataSource = ({ source }: { source: IDataSource }) => {
  console.log(source);

  return (
    <VStack spacing={4} p={4} border="1px solid" borderColor="gray.300" borderRadius="md" w="fit-content">
      <Image src={source.logo} maxW={24} />
      <Text fontWeight="semibold">{source.name}</Text>
    </VStack>
  );
};
