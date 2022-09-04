import { Box } from "@chakra-ui/react";
import React from "react";
import { connectHitsPerPage } from "react-instantsearch-dom";
import { Select } from "chakra-react-select";

interface InstantSearchSelectItem {
  label: string;
  value: number;
  isRefined: boolean;
}

export const ChakraHitsPerPage = ({
  items,
  refine,
}: {
  items: InstantSearchSelectItem[];
  refine: (value: number) => void;
}) => {
  return (
    <Box w={40} borderRadius="md">
      <Select
        onChange={(item: InstantSearchSelectItem) => {
          refine(item.value);
        }}
        size="sm"
        borderRadius="md"
        value={items.filter((item) => item.isRefined)[0]}
        options={items}
      ></Select>
    </Box>
  );
};

export const HitsPerPage = connectHitsPerPage(ChakraHitsPerPage);
