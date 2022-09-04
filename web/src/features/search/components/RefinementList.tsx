import { connectRefinementList } from "react-instantsearch-dom";
import {
  RefinementListProvided,
  RefinementListExposed,
} from "react-instantsearch-core";

import React, { useState } from "react";
import {
  Box,
  Text,
  Tag,
  Select,
  Checkbox,
  Tooltip,
  Button,
  Flex,
  IconButton,
} from "@chakra-ui/react";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
export const ChakraRefinementList = ({
  items,
  refine,
  limit,
  showMore,
  showMoreLimit,
  ...props
}: RefinementListProvided & RefinementListExposed) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <Box>
      {items.slice(0, expanded ? showMoreLimit || limit : limit).map((item) => (
        <Box
          key={item.label}
          display="flex"
          w="full"
          alignItems="center"
          my={0.5}
        >
          {/* TODO: fix stay focused on old checkbox when the value moves to the top after refinement */}
          <Checkbox
            mr={2}
            isChecked={item.isRefined}
            onChange={(event) => {
              event.preventDefault();
              refine(item.value);
            }}
          />
          <Tooltip label={item.label}>
            <Text isTruncated> {item.label}</Text>
          </Tooltip>
          <Box flexGrow={1} w={1}></Box>
          <Tag flexShrink={0} w="fit-content" h="fit-content">
            {item.count}
          </Tag>
        </Box>
      ))}
      {showMore ? (
        <Flex justifyContent="center">
          {/* Show More */}
          {/* <Text fontWeight="medium" color="gray.500">Show More</Text> */}
          <Button
            size="xs"
            variant="outline"
            w="full"
            color="gray.500"
            onClick={() => setExpanded(!expanded)}
          >
            <Flex alignItems="center">
              <Text fontWeight="medium" mr={0.5}>
                {expanded ? "Hide" : "Show More"}
              </Text>
              {expanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
            </Flex>
          </Button>
          {/* <IconButton size="xs" variant="outline" w="full" icon={<BsThreeDots />} aria-label="expand"/> */}
        </Flex>
      ) : null}
    </Box>
  );
};

export const RefinementList = connectRefinementList(ChakraRefinementList);
