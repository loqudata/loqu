
import {
  Box,
  Flex,
  Heading,
  VStack,
  Text,
  Image,
  HeadingProps,
  HStack,
} from "@chakra-ui/react";
import React from "react";
import { DynamicTypist } from "./Typer";

import { processImportedFile } from "utils/processImportedFile";

import rawSearch from "assets/loqu_search.png";
const searchImage = processImportedFile(rawSearch);

import rawIcon from "assets/world_dots_grey.svg";
const worldIcon = processImportedFile(rawIcon);

import visualizeRaw from "assets/visualize.svg";
const visualizeImage = processImportedFile(visualizeRaw);


import loquVisualizeRaw from "assets/loqu_visualize.png";
import { Footer } from "./Footer";
const loquVisualizeImage = processImportedFile(loquVisualizeRaw);

const hProps: HeadingProps = {
  fontWeight: "regular",
  letterSpacing: "tighter",
  lineHeight: "1.2",
};

const headingLargeSize = { base: "xl", md: "3xl" };
const subHeadingSize = { base: "regular", md: "xl" };

function HeadlineSection() {
  return (
    <VStack spacing={6} alignItems="start" w="lg" mr={{ base: -16, md: 3 }}>
      <VStack color="gray.700" alignItems="start">
        <Heading {...hProps} fontSize={headingLargeSize}>
          Explore, search, and visualize
        </Heading>
        <Heading
          {...hProps}
          display="flex"
          flexDir="row"
          // size="3xl"
          fontSize={{ base: "5xl", md: "6xl" }}
          maxW="40vw"
          flexWrap={{ base: "wrap", lg: "nowrap" }}
        >
          <DynamicTypist />
          data
        </Heading>
      </VStack>
      <Text
        {...hProps}
        fontSize={subHeadingSize}
        w="fit-content"
        maxW={{ base: "sm", md: "2lg" }}
      >
        Discover 700 million data series and 1.2 million datasets from hundreds
        of official sources.
      </Text>
    </VStack>
  );
}
const features = [
  {
    name: "Visualize",
    description: [
      "Explore the data and get inspired with recommended charts.",
      "Then build your own, mapping data fields to visual properties like color, size, shape, or the X and Y axes.",
    ],
    image: loquVisualizeImage,
  },
  {
    name: "Search",
    description:
      "Filter and facet datasets by file format, license, date, or update frequency.",
    image: searchImage,
  },
];

function Feature({
  name,
  description,
  image,
  textSide,
}: { textSide: "left" | "right" } & typeof features[0]) {
  const text = (
    <Box w="sm">
      <Heading {...hProps} fontWeight="bold" letterSpacing="tight" fontSize={headingLargeSize}>
        {name}
      </Heading>
      {Array.isArray(description) ? (
        description.map((el) => (
          <Text
            mt={3}
            color="gray.700"
            fontSize={subHeadingSize}
            letterSpacing="tighter"
          >
            {el}
          </Text>
        ))
      ) : (
        <Text
          mt={3}
          color="gray.700"
          fontSize={subHeadingSize}
          letterSpacing="tighter"
        >
          {description}
        </Text>
      )}
    </Box>
  );
  const visual = (
    <Box
      w={{
        base: "fit-content",
        xl: "60%",
      }}
      borderRadius="md"
      border="1px solid"
      borderColor="gray.300"
      p={2}
    >
      <Image src={image}></Image>
    </Box>
  );
  return (

    <HStack
      justifyContent="center"
      // alignItems="start"
      spacing={12}
      flexDir={{
        base: "column",
        xl: "row",
      }}
      gap={3}
    >
      {textSide == "left" ? [text, visual] : [visual, text]}
    </HStack>
  );
}

export const LandingPage = () => {
  return (
    <>
      <Box p={{ base: 4, md: 8, lg: 16 }} pt={0}>
        <Flex
          justifyContent="center"
          alignItems="center"
          pt={20}
          pb={{ base: 16, lg: 36 }}
          flexDir={{ base: "column", md: "row" }}
          gap={10}
        >
          <HeadlineSection></HeadlineSection>
          <Box mt={null}>
            <Image maxH="50vh" maxW="50vw" src={visualizeImage} />
          </Box>
        </Flex>
        <VStack spacing={28}>
          {features.map((f, i) => (
            <Feature textSide={i % 2 == 0 ? "left" : "right"} {...f}></Feature>
          ))}
        </VStack>
      </Box>
      <Footer/>
    </>
  );
};
