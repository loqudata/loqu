import React from "react";

import { Box, Heading, SimpleGrid, Text } from "@chakra-ui/react";
import DataSource from "../components/DataSource";
import { dataSources } from "../services/dataSources";
import { responsivePadding } from "../../../shared/theme";

export const DataSourcePage = () => {
  return (
    <Box p={responsivePadding}>
      <Heading mb={2} letterSpacing="tighter">
        Data Sources
      </Heading>
      <Text color="gray.600" mb={3} letterSpacing="tight" maxW="container.xl">
        Loqu aggregates data from many official data sources. However, we are
        not affiliated or endorsed by any of the organizations on our site.
        <br />
        Also, the sources listed here may not exactly match those available on
        the Search page during a period of initial development.
      </Text>
      <SimpleGrid columns={[2, 2, 3, 4, 5, 6]} spacing={[2, 3]}>
        {dataSources.map((s) => (
          <DataSource
            key={s.wikidataID || s.name}
            source={{
              title: s.name,
              description: s.description || "",
              image: s.logoImage,
              wikidataID: s.wikidataID,
              region: s.normalizedRegion,
            }}
          ></DataSource>
        ))}
      </SimpleGrid>
      <Text
        fontSize="sm"
        maxW="container.md"
        color="gray.600"
        mt={3}
        letterSpacing="tight"
      >
        The names and logos here may be trademarks of their respective owners
        and are used solely for descriptive purposes. The logos are from
        Wikimedia Commons and have been published by that organization under
        their public domain or fair use policies.
        {/* may be displayed by fair use under Section 107 of
        the Copyright Act or because they are in the public domain. */}
      </Text>
    </Box>
  );
};
