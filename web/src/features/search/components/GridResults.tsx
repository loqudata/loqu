import { SimpleGrid } from "@chakra-ui/react";
import React from "react";

import { HitsProvided } from "react-instantsearch-core";

import { connectHits } from "react-instantsearch-dom";
import { NormalDataset } from "../services/typesenseModel";
import { NotFound } from "./NotFound";
import { Result } from "./Result";

const InternalGridResults = ({ hits }: HitsProvided<NormalDataset>) => {
  if (hits.length < 1) {
    return <NotFound />;
  }

  return (
    <SimpleGrid columns={[1, null, null, 2, null, 3]} spacing="2">
      {hits.map((hit) => (
        <Result hit={hit} key={hit.objectID} />
      ))}
    </SimpleGrid>
  );
};

export const GridResults = connectHits(InternalGridResults);
