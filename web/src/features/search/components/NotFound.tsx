import { Heading, Img, Stack, Text, Flex } from "@chakra-ui/react";
import React from "react";

import NotFoundDrawing from "../../../assets/undraw_not_found.svg";

export const NotFound = () => {
  return (
    <Flex
      direction="column"
      alignItems="center"
      justifyContent="center"
      backgroundColor="blue.50"
      minH="20vh"
      h="full"
      w="full"
      borderRadius="md"
      p={8}
    >
      <Img src={NotFoundDrawing.src} w="30%" />
      <Stack textAlign="center" mt={8}>
        <Heading size="lg" color="gray.700">
          No results found.
        </Heading>
        <Text color="gray.800">
          {/* some really obscure data */}
          I'm impressed—you're looking for something interesting! Try another
          search, or let us know if we can help.
          {/* If you're here you probably have no idea what you're looking for, or
          you do, and we don't have it, in which case I'm impressed, and let
          me know if we can add it. */}
          {/* That's great! Try another search. or 
          I'm impressed; you're looking
          for some really obscure data! Let us know if we can add it. */}
        </Text>
      </Stack>
    </Flex>
  );
};
