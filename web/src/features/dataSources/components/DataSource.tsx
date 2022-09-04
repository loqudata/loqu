import React from "react";
import {
  Box,
  Image,
  Heading,
  Text,
  Flex,
  Button,
  Badge,
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { ButtonLink } from "../../../components/ButtonLink";

interface IDataSource {
  title: string;
  description: string;
  region?: string;
  wikidataID?: string;
  image?: string;
  status?: string;
}

export default function DataSource({ source }: { source: IDataSource }) {
  return (
    <Flex
      backgroundColor="white"
      border="1px solid lightgrey"
      borderRadius="lg"
      mb={3}
      direction="column"
    >
      {source.image ? (
        // TODO: fix issue with SVGs not preserving aspect ratio
        <Flex
          justifyContent="center"
          borderBottom="1px solid lightgrey"
          maxHeight="100px"
        >
          <Image height="100px" src={source.image} p={[2, 4]} />
        </Flex>
      ) : null}

      <Flex direction="column" p={[3, 5]} flexGrow={1}>
        <Heading letterSpacing="tight" size="sm">
          {source.title} <Badge>{source.region}</Badge>
        </Heading>
        <Text
          letterSpacing="tight"
          mt={1}
          mb={3}
          size="xs"
          color="gray.600"
          flexGrow={1}
        >
          {source.description}
        </Text>
        {source.wikidataID ? (
          <ButtonLink
            href={"https://www.wikidata.org/wiki/" + source.wikidataID}
            alignSelf="end"
            // width="fit-content"
            width="full"
            size="sm"
            variant="outline"
            rightIcon={<ExternalLinkIcon />}
          >
            Wikidata
          </ButtonLink>
        ) : null}
      </Flex>
    </Flex>
  );
}
