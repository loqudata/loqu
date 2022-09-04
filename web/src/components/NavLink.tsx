import React from "react";
import { useRouter } from "next/router";
import { Box, VStack, Text, Center } from "@chakra-ui/react";
import { Link } from "./Link";

export const NavLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const active = router.route == href;
  return (
    <VStack h="full" alignItems="center" spacing={0}>
      <Link
        href={href}
        chakraProps={{ _hover: { textDecoration: "none" }, h: "full" }}
      >
        <Center h="full">
          <Text
            color={active ? "green.600" : "gray.500"}
            _hover={{ color: !active ? "gray.700" : "" }}
            fontWeight={active ? "semibold" : "medium"}
          >
            {children}
          </Text>
        </Center>
      </Link>
      {/* <Box
        backgroundColor="green.600"
        display={active ? "block" : "none"}
        h="2px"
        w="120%"
      ></Box> */}
    </VStack>
  );
};
