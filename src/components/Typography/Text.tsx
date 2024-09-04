import React, { ForwardedRef } from "react";
import { ITypography } from "./types";
import { Text } from "@chakra-ui/react";
import { getTagName, styleMap } from "./common";

// eslint-disable-next-line react/display-name
const TextCustom = React.forwardRef(
  ({ children, type, ...rest }: ITypography, ref: ForwardedRef<HTMLParagraphElement>) => {
    const styleBase = styleMap[type];
    const tagName = getTagName(type);
    return (
      <Text as={tagName as any} {...styleBase} ref={ref} {...rest}>
        {children}
      </Text>
    );
  },
);

export default TextCustom;
