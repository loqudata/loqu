import { Badge, Box, Input, InputProps } from "@chakra-ui/react";

import { connectAutoComplete, InstantSearch } from "react-instantsearch-dom";
import { AutocompleteProvided } from "react-instantsearch-core";
import React from "react";
import { searchClient } from "../services/searchClient";
import { Dataset } from "../services/typesenseModel";
// import Link from "next/link"

type Props = InputProps;

const InnerAutoComplete = ({
  hits,
  // currentRefinement,
  refine,
}: // ...props
Props & AutocompleteProvided<Dataset>) => (
  <Box>
    <Input
      m={2}
      ml={0.5}
      placeholder="Data starts here"
      // {...props}
      onChange={(event) => refine(event.currentTarget.value)}
    ></Input>

    <Box width="full" px={1} py={0} maxHeight="md" overflow="scroll">
      {/* TODO: maybe show more but virtualized? */}
      {hits.map((hit, i) => (
        // <Link
        //   key={hit.objectID}
        //   href={"/" + hit.provider_code + "/" + hit.code}
        // >
        <Box
          p={4}
          // mx={-1}
          my={i == 0 ? 0 : 2}
          boxShadow="base"
          borderRadius="md"
          cursor="pointer"
          _hover={{ boxShadow: "lg" }}
        >
          <Badge>{hit.provider_code}</Badge> {hit.name}
        </Box>
        // </Link>
      ))}
    </Box>
  </Box>
);

const AutoComplete = connectAutoComplete(InnerAutoComplete);

const FullComplete = ({ ...props }: Props) => (
  // w={{ base: "sm", md: "lg", xl: "2xl" }}
  <Box w={{ base: "100%", md: "40vw" }} height="lg">
    <InstantSearch indexName="datasets" searchClient={searchClient}>
      <AutoComplete {...props}></AutoComplete>
    </InstantSearch>
  </Box>
);

export default FullComplete;
