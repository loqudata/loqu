import {
  Box,
  Flex,
  Heading,
  HStack,
  IconButton,
  Link,
  Text,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { NormalDataset } from "../services/typesenseModel";

import { Highlight } from "react-instantsearch-dom";
// import { BsBookmark, BsSave } from "react-icons/bs";
import { FiExternalLink } from "react-icons/fi";

import { IconButtonLink } from "../../../components/IconButtonLink";

const HighlightDescription = ({ hit }: { hit: any }) => {
  if (hit.description) {
    return (
      <Box>
        <Text
          color="gray.700"
          isTruncated
          noOfLines={3}
          whiteSpace="break-spaces"
          fontSize="sm"
        >
          <Text
            as="span"
            // fontWeight="bold"
            fontSize="sm"
            color="gray.500"
          >
            Description:{" "}
          </Text>
          {hit.description}
        </Text>
      </Box>
    );
  } else {
    return null;
  }
};

export const Result = ({ hit }: { hit: NormalDataset }) => {
  return (
    <Link
      href={
        "/visualize?id=" +
        encodeURIComponent(hit.id) +
        "&portal=" +
        encodeURIComponent(hit.portal_source)
      }
      _hover={{ textDecoration: "none" }}
    >
      <Box
        minW="2xs"
        p="4"
        borderRadius="lg"
        border="1px solid lightgrey"
        _hover={{ boxShadow: "base" }}
      >
        {/* <Tag> {hit.provider_code.toUpperCase()}</Tag>{" "} */}
        <VStack spacing={2} alignItems="initial">
          <Flex>
            <Heading size="sm" display="inline" flexGrow={1}>
              {/* {hit.name} */}
              <Highlight hit={hit} attribute="name" />{" "}
              <Text
                fontSize="sm"
                display="inline"
                fontWeight="normal"
                color="gray.600"
              >
                {/* TODO: use human-readable name for data portals. Maybe an icon and hover?*/}
                from {hit.portal_source}
              </Text>
            </Heading>
            <HStack h="fit-content" spacing={1}>
              <IconButtonLink
                href={"https://" + hit.portal_source + "/resource/" + hit.id}
                size="xs"
                variant="outline"
                aria-label="open original source"
              >
                <FiExternalLink />
              </IconButtonLink>

              {/* This will be a redux action. When signed out, do a modal,
              or maybe just a tooltip saying you need to sign up/in. Actually save when in */}
              {/* <IconButton size="xs" variant="outline" aria-label="bookmark/save dataset">
                <BsBookmark />
              </IconButton> */}
            </HStack>
          </Flex>
          <HighlightDescription hit={hit} />
          <Text fontSize="sm">
            <Text
              fontSize="sm"
              as="span"
              // fontWeight="bold"
              color="gray.500"
            >
              Created:
            </Text>{" "}
            {new Date(hit.created_at * 1000).toLocaleDateString()}{" "}
            <Text
              fontSize="sm"
              as="span"
              // fontWeight="bold"
              color="gray.500"
            >
              Updated:
            </Text>{" "}
            {new Date(hit.updated_at * 1000).toLocaleDateString()}{" "}
            <Text
              fontSize="sm"
              as="span"
              // fontWeight="bold"
              color="gray.500"
            >
              Update Frequency:
            </Text>{" "}
            {hit.update_frequency}
          </Text>
        </VStack>
      </Box>
    </Link>
  );
};
