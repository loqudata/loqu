import { VscSymbolKey } from "react-icons/vsc";
import { BiCalendar, BiHash, BiTime } from "react-icons/bi";
import { Icon, IconProps } from "@chakra-ui/react";

// import { Icon } from '@iconify/react';

const vegaTypeMap = {
  nominal: { icon: VscSymbolKey },
  quantitative: { icon: BiHash },
  temporal: { icon: BiCalendar },
};

// TODO: handle unknowns
// keyof typeof vegaTypeMap
export const FieldIcon = ({
  vegaType,
  ...props
}: { vegaType: keyof typeof vegaTypeMap } & IconProps) =>
  vegaTypeMap[vegaType] ? (
    <Icon
      w={4}
      h={4}
      color="gray.400"
      as={vegaTypeMap[vegaType].icon}
      {...props}
    />
  ) : null;
