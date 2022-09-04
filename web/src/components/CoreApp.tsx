import React from "react";

import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "../shared/theme";

// import "../src/styles/main.css";

import { Provider } from "react-redux";
import { store } from "../store/store";

import { AppErrorBoundary } from "./AppErrorBoundary";
import { AnalyticsContainer } from "./AnalyticsContainer";

// import dynamic from "next/dynamic";
// const AnalyticsContainer = dynamic(() => import("./AnalyticsContainer"), {
//   ssr: false,
// });

export const CoreApp: React.FC = ({ children }) => {
  return (
    <AppErrorBoundary>
      <AnalyticsContainer>
        <ChakraProvider theme={theme}>
          <Provider store={store}>{children}</Provider>
        </ChakraProvider>
      </AnalyticsContainer>
    </AppErrorBoundary>
  );
};
