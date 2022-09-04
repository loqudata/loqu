import { Button, chakra } from "@chakra-ui/react";
import React from "react";
import { useDispatch } from "react-redux";
import { Dispatch, RootState } from "store/store";

export const FileSelector = () => {
  const dispatch = useDispatch<Dispatch>();
  function handleChange(evt) {
    const f: File = evt.target.files[0];
    if (!f || f.type !== "text/csv") {
      console.log("Wrong/no file selected", f);
    } else {
      console.log("using file", f);
      dispatch.sqlQuery.updateFile(f);
    }
  }
  return (
    <>
      <Button as={chakra.label} htmlFor="file-upload" cursor="pointer">
        Select File
      </Button>
      <input
        id="file-upload"
        type="file"
        accept="text/csv"
        style={{
          display: "none",
        }}
        onChange={handleChange}
      />
    </>
  );
};
