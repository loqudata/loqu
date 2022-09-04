import React from "react";

import { CoreApp } from "../src/components/CoreApp";

// A hack for this environment
import "./main.css";

// import "ag-grid-community/dist/styles/ag-grid.css";
// import "ag-grid-community/dist/styles/ag-theme-alpine.css";

// import "flexlayout-react/style/light.css";

// No-op wrapper.
export const Wrapper = ({ children }) => {
  return <CoreApp>{children}</CoreApp>;
};
