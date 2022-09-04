import React from "react";
import { connectStats } from "react-instantsearch-dom";
import { StatsProvided } from "react-instantsearch-core";
import { Text } from "@chakra-ui/react";

const InternalStats = ({ nbHits, processingTimeMS }: StatsProvided) => {
  let hitCountPhrase;
  if (nbHits === 0) {
    hitCountPhrase = "No datasets";
  } else if (nbHits === 1) {
    hitCountPhrase = "1 dataset";
  } else {
    hitCountPhrase = `${nbHits.toLocaleString()} datasets`;
  }
  const text = `${hitCountPhrase} found in ${processingTimeMS.toLocaleString()}ms`;
  return (
    <Text color="gray.600" fontSize="sm">
      {text}
    </Text>
  );
};

export const Stats = connectStats(InternalStats);
