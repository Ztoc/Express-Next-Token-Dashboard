import React, { ForwardedRef } from "react";
import { ITypography } from "./types";
import Headline from "./Headline";
import Text from "./Text";
import { getTagName } from "./common";

// eslint-disable-next-line react/display-name
const TypographyCustom = React.forwardRef(
  ({ children, type, ...rest }: ITypography, ref: ForwardedRef<HTMLParagraphElement>) => {
    const tagName = getTagName(type);
    if (tagName === "p") {
      return (
        <Text type={type} {...rest} ref={ref}>
          {children}
        </Text>
      );
    }
    return (
      <Headline type={type} {...rest} ref={ref}>
        {children}
      </Headline>
    );
  },
);

export default TypographyCustom;
