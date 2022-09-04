import { Box, Text, HStack, VStack, Flex } from "@chakra-ui/react";
import {
  DuckDBField,
  DuckDBToVegaTypes,
  getFields,
} from "features/duckdb/getFields";
import { useAppSelector } from "hooks";
import { IWorkspacePanelComponentProps } from "models/workspace";
import React from "react";
import exampleFields from "./exampleFields.json";
import { FieldIcon } from "./FieldIcon";

export const ConnectedFields = () => {
  const fields = useAppSelector((s) => s.sqlQuery.duckDBFields?.map(convertDuckDBField));
  if (Array.isArray(fields) && fields.length > 0) {
    return <Fields fields={fields}/>;
  } else {
    return <Box p={2}>You haven't loaded a file</Box>;
  }
};

interface IField {
  name: string;
  description?: string;
  /** A vega-lite type */
  type: string;
}

export function convertDuckDBField(d: DuckDBField): IField {
  return {
    name: d.name,
    // To test width stuff
    description: null, //loremloremlorem loremloremloremloremloremloremloremlo remloremloremloremlore mloremloremloremlorem
    type: DuckDBToVegaTypes[d.type] || "unknown",
  };
}

export const Field = ({ field, standalone }: { field: IField, standalone: boolean }) => {
  return (
    <Box borderRadius={standalone ? null : "md"} alignItems="start" py={1.5}  mx={-2}  px={2} _hover={{backgroundColor: "blue.50"}}>
      {/* flex wrap + gap = good spacing and auto wrap when exceeds container width */}
      <Flex
        sx={{ rowGap: 1, columnGap: 2 }}
        flexWrap="wrap"
        alignItems="center"
      >
        <FieldIcon vegaType={field.type as any} />
        <Text fontWeight="medium" color="gray.800" fontSize="12px">
          {field.name}
        </Text>
        <Text color="gray.500" fontSize="12px" minW="fit-content">
          {field.description || `The ${field.name} field`}
        </Text>
      </Flex>
    </Box>
  );
};

export const Fields = ({ fields = exampleFields.map(convertDuckDBField), standalone = true }: {fields: IField[]} & IWorkspacePanelComponentProps) => {
  return (
    <Box borderRadius="md" {...(standalone  ? {p: 2} : {})}>
      {fields?.map((f) => (
        <Field key={f.name} field={f} standalone={standalone}></Field>
      ))}
    </Box>
  );
};
