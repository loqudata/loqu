/** These components are used by the MDX provider to render MDX elements */
/* eslint-disable react/display-name */
import { Text, ListItem, UnorderedList, OrderedList, Heading, Link } from "@chakra-ui/react";
import React from "react";

//  Creating the components mapping
export const components = {
  h1: ({ children }: { children: React.ReactElement }) => (
    <Heading fontSize="3xl" mb={3}>
      {children}
    </Heading>
  ),
  h2: ({ children }: { children: React.ReactElement }) => (
    <Heading fontSize="2xl" my={3}>
      {children}
    </Heading>
  ),
  h3: ({ children }: { children: React.ReactElement }) => (
    <Heading fontSize="lg" my={3}>
      {children}
    </Heading>
  ),
  ul: ({ children }: { children: React.ReactElement }) => (
    <UnorderedList my={0} listStyleType={undefined}>
      {children}
    </UnorderedList>
  ),
  ol: ({ children }: { children: React.ReactElement }) => (
    <OrderedList>
      {children}
    </OrderedList>
  ),
  li: ({ children }: { children: React.ReactElement }) => (
    <ListItem>{children}</ListItem>
  ),
  p: ({ children }: { children: React.ReactElement }) => (
    <Text my={2}>{children}</Text>
  ),
  //   Header,
  HeaderText: ({ children }: { children: React.ReactElement }) => (
    <Heading>{children}</Heading>
  ),
  a: ({ children, href }: { children: React.ReactElement; href: string }) => (
    <Link href={href} color="primary.600">{children}</Link>
  ),
  //   Section,
  //   Layout,
};

export const getMarkdownToJSXComponents = () => {
  let newComps: any = {};
  for (const key in components) {
    newComps[key] = { component: components[key] };
    if (key.includes("h")) {
      // console.log(key);
      // newComps[key].component.style={display: "block"}
    }
  }
  return newComps;
};
