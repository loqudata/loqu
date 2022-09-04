import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Code,
  Link,
  Box,
} from "@chakra-ui/react";

const helpText = `-- list all databases, usually one
PRAGMA database_list;
-- list all tables
PRAGMA show_tables;
-- get info for a specific table
PRAGMA table_info('table_name');
-- also show table structure, but slightly different format (for compatibility)
PRAGMA show('table_name');`;

export function HelpModal({ isOpen, onOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>DuckDB SQL Help</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box as="pre" style={{ overflow: "scroll" }} mb={3}>
            <Code>{helpText}</Code>
          </Box>
          {/* For some reason doesn't work in React Preview */}
          <Link color="blue.600" target="_blank" href="https://duckdb.org/docs/sql/pragmas">
            More documentation
          </Link>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
          <Button variant="ghost">Secondary Action</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
