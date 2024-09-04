import React, { ForwardedRef } from "react";
import { ITypography } from "./types";
import { Heading } from "@chakra-ui/react";
import { getTagName, styleMap } from "./common";

// eslint-disable-next-line react/display-name
const Headline = React.forwardRef(
  ({ children, type, ...rest }: ITypography, ref: ForwardedRef<HTMLParagraphElement>) => {
    const styleBase = styleMap[type];
    const tagName = getTagName(type);
    return (
      <Heading as={tagName as any} {...styleBase} ref={ref} {...rest}>
        {children}
      </Heading>
    );
  },
);

export default Headline;
