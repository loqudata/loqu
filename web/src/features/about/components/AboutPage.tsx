import { Box, Container, Heading, Stack, Text } from "@chakra-ui/react";
import React from "react";

import { responsivePadding, responsivePaddingY, theme } from "shared/theme";
import { AboutText } from "./AboutText";


export const AboutPage = () => {
  return (
    <Box>
      <Stack backgroundColor="gray.50" w="full" p={responsivePadding}>
        <Heading fontFamily="serif">About</Heading>
        <Text maxW="container.sm">
          Loqu is an open data platform that leverages community to
          provide more accessible and useful data for everyone. We’ll
          describe the problems we encountered and our solution below.
          {/* Users collaborate on visualizations and link datasets together to make
          them more useful for everyone. This provide benefits for all, not just
          those who can pay for data licenses from data brokers.  */}
        </Text>
      </Stack>
      <Container maxW="3xl" py={responsivePadding}>
        <AboutText/>
      </Container>
    </Box>
  );
};
