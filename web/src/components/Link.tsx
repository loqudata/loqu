import React from "react";
import NextLink, { LinkProps as NextLinkProps } from "next/link";
import {
  Link as ChackraLink,
  LinkProps as ChackraLinkProps,
} from "@chakra-ui/react";

interface ILinkProps extends NextLinkProps {
  chakraProps?: ChackraLinkProps;
  children?: React.ReactNode;
}

export const Link = (props: ILinkProps) => {
  const { chakraProps, children } = props;
  const nextLinkProps = {
    ...props,
    chackraLink: undefined,
    children: undefined,
  };
  return (
    <NextLink {...nextLinkProps} passHref>
      <ChackraLink {...chakraProps}>{children}</ChackraLink>
    </NextLink>
  );
};
