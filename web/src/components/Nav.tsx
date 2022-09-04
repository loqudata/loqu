import { Box, Button, Flex, Heading, HStack, useDisclosure } from "@chakra-ui/react";
import React from "react";
import { responsivePadding } from "../shared/theme";
import { NavLink } from "./NavLink";
import { Link } from "./Link";
import { LoginModal } from "features/logins/LoginModal";
import { ButtonLink } from "./ButtonLink";

const routes = [
  { name: "About", path: "/about" },
  { name: "Data Sources", path: "/sources" },
  { name: "Search", path: "/search" },
  { name: "Visualize", path: "/visualize" },
];

export const Nav = () => {
  const login = useDisclosure();
  const signUp = useDisclosure();
  return (
    // TODO: make the distance from each side uniform
    <Flex
      as="nav"
      px={responsivePadding}
      // py={2}
      boxShadow="sm"
      // borderBottom="1px solid lightgrey"
      position="relative"
      zIndex="999"
      backgroundColor="white"
      alignItems="center"
    >
      <Box mr={6} my={3}>
        <Link href="/">
          <Heading
            cursor="pointer"
            fontWeight="medium"
            letterSpacing="tighter"
            // color="#332455"
            fontFamily="Quicksand"
            size="lg"
            lineHeight="0.8"
            position="relative"
            top="-2px"
          >
            loqu
          </Heading>
        </Link>
      </Box>

      <HStack spacing={5} alignSelf="stretch" flexGrow={0.2}>
        {routes.map((route) => (
          <NavLink key={route.path} href={route.path}>
            {route.name}
          </NavLink>
        ))}
      </HStack>
      <Box flexGrow={1} />
      <ButtonLink href="https://github.com/loqudata" size="sm" colorScheme="primary" variant="outline" >
        View on Github
      </ButtonLink>
      {/* <Button size="sm" variant="outline" ml={6} mr={2} onClick={login.onOpen}>
        Log in
      </Button>
      <Button size="sm" colorScheme="primary" variant="outline" onClick={signUp.onOpen}>
        Sign Up
      </Button>
      <LoginModal loginOption="login" {...login}/>
      <LoginModal loginOption="signup" {...signUp}/> */}
    </Flex>
  );
};
