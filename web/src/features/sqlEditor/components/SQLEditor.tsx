import {
  Box,
  Button,
  Flex,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

import Editor from "@monaco-editor/react";

import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
export type Monaco = typeof monaco;
export type IMonacoEditor = monaco.editor.IStandaloneCodeEditor;

import { useSelector, useDispatch } from "react-redux";
import { Dispatch, RootState } from "store/store";
import { sqlQuery } from "models/sqlQuery";

import { HelpModal } from "./HelpModal";
export const SQLEditor = () => {
  const dispatch = useDispatch<Dispatch>();

  const error = useSelector<RootState>((state) => state.sqlQuery.error);
  const query = useSelector<RootState>(
    (state) => state.sqlQuery.query
  ) as string;

  const toast = useToast();

  useEffect(() => {
    if (error) {
      toast({
        title: "Error running query",
        description: String(error),
        status: "error",
        duration: 10000,
        isClosable: true,
        onCloseComplete: () => dispatch.sqlQuery.setError(null),
      });
    }

    return () => {};
  }, [error]);

  // function runQuery() {
  //   dispatch.sqlQuery.runQuery(query);
  // }

  function handleEditorDidMount(editor: IMonacoEditor, monaco: Monaco) {
    editor.addAction({
      id: "loqu:runDuckDBQuery",
      label: "Run SQL Query",
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter],
      run: () => dispatch.sqlQuery.runQuery(null),
    });
  }

  const { onOpen, ...modalProps } = useDisclosure();
  return (
    <Flex height="100%" direction="column">
      <Flex alignItems="center" p={2}>
        <Box flexGrow={1} />
        {/* <Text color="gray.700">Run Query</Text> */}
        <Button size="sm" onClick={onOpen}>
          Show Help
        </Button>
        <HelpModal onOpen={onOpen} {...modalProps} />
        <Tooltip label="You can also use Ctrl+Enter from the editor.">
          <Button size="sm" onClick={() => dispatch.sqlQuery.runQuery(null)}>
            Run Query
          </Button>
        </Tooltip>
      </Flex>
      <Box height="calc(100% - 80px);">
        <Editor
          defaultLanguage="sql"
          value={query}
          onChange={(q) => dispatch.sqlQuery.setQuery(q)}
          onMount={handleEditorDidMount}
        />
      </Box>
    </Flex>
  );
};
