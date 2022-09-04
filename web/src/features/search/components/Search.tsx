import { Box, Heading, HStack, Text } from "@chakra-ui/react";
import { Flex } from "@chakra-ui/react";
import React from "react";
import { InstantSearch } from "react-instantsearch-dom";
import { searchClient } from "../services/searchClient";
import { RefinementList } from "./RefinementList";
import { HitsPerPage } from "./HitsPerPage";
import { SortBy } from "./SortBy";
import { Stats } from "./Stats";

// With both these searchboxes, the overall experience feels slower
// Could it be Chakra UI doing runtime styling?
// TODO: Need to profile the overall and see if its my code,
// like the filters.slice call and what we can fix
import { SearchBox } from "./SearchBox";
// import {SearchBox} from "react-instantsearch-dom"

import { GridResults } from "./GridResults";
import { responsivePadding, responsivePaddingY } from "../../../shared/theme";

export const Search = () => (
  <Box px={responsivePadding} py={responsivePaddingY}>
    <InstantSearch indexName="datasets_2" searchClient={searchClient}>
      <Flex w="full" direction={["column", null, null, "row"]}>
        <Box flexGrow={1} mr={[0, null, null, 4]}>
          <SearchBox />
        </Box>
        <HStack mt={[2, null, null, 0]} alignContent="center">
          <Stats />
          <HitsPerPage
            items={[
              { label: "5 per page", value: 5 },
              { label: "10 per page", value: 10 },
              { label: "15 per page", value: 15 },
              { label: "20 per page", value: 20 },
            ]}
            defaultRefinement={10}
          />
          <SortBy
            items={[
              { label: "Relevancy", value: "datasets_2" },
              {
                label: "Created at (asc)",
                value: "datasets_2/sort/created_at:asc",
              },
              {
                label: "Created at (desc)",
                value: "datasets_2/sort/created_at:desc",
              },
            ]}
            defaultRefinement="datasets_2"
          />
        </HStack>
      </Flex>
      <Flex>
        {/* TODO: listStyle: none */}
        <Box minW="2xs" w="15%" pt={4} pr={4} mr={4}>
          {/* TODO: make filters a dropdown on mobile
          Use https://choc-ui.tech/docs/elements/headers */}
          <Heading size="md">Filters</Heading>
          <Heading mt={3} mb={1} size="sm" color="gray.500">
            {"Data Sources".toUpperCase()}
          </Heading>
          <RefinementList
            attribute="portal_source"
            limit={5}
            showMore={true}
            showMoreLimit={10}
          />
          <Heading mt={4} mb={1} size="sm" color="gray.500">
            {"Formats".toUpperCase()}
          </Heading>
          <RefinementList attribute="formats" limit={5} />
          <Heading mt={4} mb={1} size="sm" color="gray.500">
            {"Update Frequency".toUpperCase()}
          </Heading>
          <RefinementList attribute="update_frequency" limit={5} />
          <Heading mt={4} mb={1} size="sm" color="gray.500">
            {"Date created".toUpperCase()}
          </Heading>
          {/* <RangeSlider attribute="updated_at"/> */}
        </Box>
        <Box flexGrow={1} pt={4}>
          <GridResults />
        </Box>
      </Flex>
    </InstantSearch>
  </Box>
);
