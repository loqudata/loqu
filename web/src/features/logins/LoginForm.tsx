import { Input, VisuallyHidden, VStack } from "@chakra-ui/react";
import React from "react";

export const LoginForm = () => {
  return (
    <VStack>
      <VisuallyHidden>Username/Email Address</VisuallyHidden>
      <Input mt={0} type="email" placeholder="Email Address" required />
      <VisuallyHidden>Password</VisuallyHidden>
      <Input mt={0} type="password" placeholder="Password" required />
      {/* TODO: consider social */}
    </VStack>
  );
};
