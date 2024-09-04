import { TextProps } from "@chakra-ui/react";

export type TypographyType =
  | "large-title"
  | "huge-text"
  | "headline1"
  | "headline2"
  | "headline3"
  | "headline4"
  | "headline5"
  | "headline6"
  | "headline7"
  | "paragraph1"
  | "paragraph2"
  | "paragraph3"
  | "body1"
  | "body2"
  | "body1-r"
  | "body2-r"
  | "body3"
  | "body3-r"
  | "body4"
  | "body4-r"
  | "button1"
  | "button2"
  | "button3"
  | "caption1-r"
  | "caption2-r";

export interface ITypography extends TextProps {
  /** type of typography */
  type: TypographyType;
  ref?: any;
}
