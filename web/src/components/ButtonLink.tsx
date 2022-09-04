import { Link, Button, ButtonProps } from "@chakra-ui/react";
import React, { ReactNode } from "react";

interface ButtonLinkProps {
  href: string;
  children: ReactNode;
}
export const ButtonLink = ({
  href,
  children,
  ...props
}: ButtonLinkProps & ButtonProps): JSX.Element => {
  return (
    //   TODO: improve so that flex and width props go to outer element, but button visual styles go to inner element
    <Link _hover={{ textDecoration: "none" }} href={href} isExternal>
      <Button as="div" {...props}>
        {children}
      </Button>
    </Link>
  );
};
