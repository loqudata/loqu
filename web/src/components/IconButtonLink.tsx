import { Link, IconButton, IconButtonProps } from "@chakra-ui/react";
import React, { ReactNode } from "react";

interface IconButtonLinkProps {
  href: string;
  children: ReactNode;
}
export const IconButtonLink = ({
  href,
  children,
  ...props
}: IconButtonLinkProps & IconButtonProps): JSX.Element => {
  return (
    //   TODO: improve so that flex and width props go to outer element, but button visual styles go to inner element
    <Link _hover={{ textDecoration: "none" }} href={href} isExternal>
      <IconButton as="div" {...props}>
        {children}
      </IconButton>
    </Link>
  );
};
