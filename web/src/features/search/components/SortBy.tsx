import { Box } from "@chakra-ui/react";
import React from "react";
import { connectSortBy } from "react-instantsearch-dom";
import { Select } from "chakra-react-select";

interface InstantSearchSelectItem {
  label: string;
  value: number;
  isRefined: boolean;
}

export const ChakraSortBy = ({
  items,
  refine,
}: {
  items: InstantSearchSelectItem[];
  refine: (value: number) => void;
}) => {
  return (
    <Box w={44} borderRadius="md">
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

export const SortBy = connectSortBy(ChakraSortBy);
