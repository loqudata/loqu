import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  UseDisclosureProps,
  Center,
  Text,
} from "@chakra-ui/react";
import { SignupForm } from "./SignupForm";
import { LoginForm } from "./LoginForm";

const loginTypes = {
  login: {
    action: "Log In",
    description: "Hi there, welcome back!",
    components: <LoginForm/>,
  },
  signup: {
    action: "Sign Up",
    description: "Hi, we're excited for you to join our community!",
    components: <SignupForm />,
  },
};

export interface ILoginProps {
  loginOption: keyof typeof loginTypes;
}

export const LoginModal = ({
  loginOption,
  isOpen,
  onClose,
}: UseDisclosureProps & ILoginProps) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
    <ModalContent as="form">
      <ModalHeader pb={1}>{loginTypes[loginOption].action}</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        {/* <Center> */}
          <Text color="gray.600" mb={1}>{loginTypes[loginOption].description}</Text>
        {/* </Center> */}
        {loginTypes[loginOption].components}
      </ModalBody>

      <ModalFooter pt={2}>
        {/* <Button colorScheme="red" variant="outline" mr={3} onClick={onClose}>
          Close
        </Button> */}
        <Button colorScheme="primary" type="submit">{loginTypes[loginOption].action}</Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
);
