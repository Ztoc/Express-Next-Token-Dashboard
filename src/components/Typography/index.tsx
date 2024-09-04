import React from "react";
import Headline from "./Headline";
import Text from "./Text";
import TypographyCustom from "./Typography";

export type TypographyProps = typeof TypographyCustom & {
  Text: typeof Text;
  Heading: typeof Headline;
};

const Typography = TypographyCustom as TypographyProps;

Typography.Heading = Headline;
Typography.Text = Text;

export { Typography };
