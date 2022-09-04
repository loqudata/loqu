import { SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  Input,
  InputGroup,
  InputLeftElement,
  InputProps,
} from "@chakra-ui/react";
import React from "react";
import { connectSearchBox } from "react-instantsearch-dom";
import { SearchBoxProvided } from "react-instantsearch-core";

// I coupled this to Next pretty closely. In the future, uncouple.
// The query param should be passed from a higher
// Also, because the actual InstantSearchJS value is not updated except for our hack
import { NextRouter, useRouter } from "next/router";

export const ChakraSearchBox = ({
  currentRefinement,
  refine,
  styleProps,
  ...props
}: SearchBoxProvided & { styleProps?: InputProps }) => {
  const rt: NextRouter | null = useRouter();
  const q = rt?.query?.q as string;

  function updateURLQueryParam(query: string) {
    rt.query.q = query;
    rt.replace(rt);
  }

  async function handleChange(event) {
    refine(event.target.value)
    updateURLQueryParam(event.target.value)
  }

  if (!currentRefinement && q) {
    refine(q);
  }

  return (
    <InputGroup>
      <InputLeftElement
        pointerEvents="none"
        children={<SearchIcon color="gray.300" />}
      />
      <Input
        {...styleProps}
        autoFocus
        placeholder="Search datasets, sources, or visualizations"

        defaultValue={q}
        onChange={handleChange}
      />
    </InputGroup>
  );
};

export const SearchBox = connectSearchBox(ChakraSearchBox);
