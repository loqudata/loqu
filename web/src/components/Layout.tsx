import React, { ReactNode } from "react";
import Link from "next/link";
import Head from "next/head";
import { Nav } from "./Nav";

import { makeGoogleFontsURL } from "utils/fonts";
import { Box } from "@chakra-ui/react";
type Props = {
  children?: ReactNode;
  title?: string;
  /** Include after the page name in the title */
  appDescription?: string;
};

const appName = "Loqu"
const appDesc = `${appName} - search and visualize open datasets`
const Layout = ({ children, title = "A Page", appDescription = appDesc }: Props) => (
  <Box>
    <Head>
      <title>{`${title} | ${appDescription}`}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <link rel="preconnect" href="https://fonts.gstatic.com" />
      <link
        href={makeGoogleFontsURL(["Inter", "Quicksand", "Merriweather"])}
        rel="stylesheet"
      />
    </Head>
    <Nav></Nav>
    {children}
    {/* <footer>
    </footer> */}
  </Box>
);

export default Layout;
