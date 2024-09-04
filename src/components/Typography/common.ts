import { TypographyType } from "./types";

export const styleMap: Record<
  TypographyType,
  {
    fontWeight: string[];
    fontSize: string[];
    lineHeight: string[];
  }
> = {
  "large-title": {
    fontWeight: ["semibold"],
    fontSize: ["32px", "32px", "40px", "40px", "64px", "64px"],
    lineHeight: ["48px", "48px", "60px", "60px", "96px", "96px"],
  },
  "huge-text": {
    fontWeight: ["bold"],
    fontSize: ["20px", "24px", "24px", "32px", "32px", "48px"],
    lineHeight: ["28px", "32px", "32px", "51px", "51px", "76px"],
  },
  headline1: {
    fontWeight: ["bold"],
    fontSize: ["24px", "24px", "40px", "40px", "48px", "48px"],
    lineHeight: ["32px", "32px", "60px", "60px", "72px", "72px"],
  },
  headline2: {
    fontWeight: ["bold"],
    fontSize: ["24px", "24px", "24px", "32px", "40px", "40px"],
    lineHeight: ["32px", "32px", "48px", "48px", "60px", "60px"],
  },
  headline3: {
    fontWeight: ["bold"],
    fontSize: ["20px", "20px", "24px", "24px", "32px", "32px"],
    lineHeight: ["28px", "28px", "32px", "32px", "48px", "48px"],
  },
  headline4: {
    fontWeight: ["bold"],
    fontSize: ["20px", "20px", "20px", "20px", "20px", "24px"],
    lineHeight: ["32px"],
  },
  headline5: {
    fontWeight: ["bold"],
    fontSize: ["18px", "18px", "20px", "20px", "20px", "20px"],
    lineHeight: ["28px"],
  },
  headline6: {
    fontWeight: ["bold"],
    fontSize: ["18px"],
    lineHeight: ["28px"],
  },
  headline7: {
    fontWeight: ["bold"],
    fontSize: ["14px", "14px", "16px", "16px", "16px", "16px"],
    lineHeight: ["20px", "20px", "24px", "24px", "24px", "24px"],
  },
  paragraph1: {
    fontWeight: ["regular"],
    fontSize: ["14px", "14px", "14px", "14px", "16px", "16px"],
    lineHeight: ["22px", "22px", "22px", "22px", "24px", "24px"],
  },
  paragraph2: {
    fontWeight: ["regular"],
    fontSize: ["14px"],
    lineHeight: ["22px"],
  },
  paragraph3: {
    fontWeight: ["regular"],
    fontSize: ["12px"],
    lineHeight: ["16px"],
  },
  body1: {
    fontWeight: ["medium"],
    fontSize: ["14px", "14px", "16px", "16px", "16px", "16px"],
    lineHeight: ["24px"],
  },
  "body1-r": {
    fontWeight: ["regular"],
    fontSize: ["16px"],
    lineHeight: ["24px"],
  },
  body2: {
    fontWeight: ["medium"],
    fontSize: ["14px"],
    lineHeight: ["20px"],
  },
  "body2-r": {
    fontWeight: ["regular"],
    fontSize: ["12px", "12px", "12px", "12px", "14px", "14px"],
    lineHeight: ["20px"],
  },
  body3: {
    fontWeight: ["medium"],
    fontSize: ["12px"],
    lineHeight: ["20px"],
  },
  "body3-r": {
    fontWeight: ["regular"],
    fontSize: ["12px"],
    lineHeight: ["20px"],
  },
  body4: {
    fontWeight: ["medium"],
    fontSize: ["10px"],
    lineHeight: ["16px"],
  },
  "body4-r": {
    fontWeight: ["regular"],
    fontSize: ["10px"],
    lineHeight: ["16px"],
  },
  button1: {
    fontWeight: ["medium"],
    fontSize: ["16px"],
    lineHeight: ["24px"],
  },
  button2: {
    fontWeight: ["medium"],
    fontSize: ["14px"],
    lineHeight: ["20px"],
  },
  button3: {
    fontWeight: ["medium"],
    fontSize: ["14px"],
    lineHeight: ["20px"],
  },
  "caption1-r": {
    fontWeight: ["regular"],
    fontSize: ["14px"],
    lineHeight: ["20px"],
  },
  "caption2-r": {
    fontWeight: ["regular"],
    fontSize: ["10px"],
    lineHeight: ["16px"],
  },
};

/**
 * @description get element name by type of typo
 * @param type of TypographyType
 * @returns {string} name of tag
 */
export const getTagName = (type: TypographyType): string => {
  if (["headline", "title"].includes(type)) {
    if (["title"].includes(type)) {
      return "h1";
    }
    return `h${type[type.length - 1]}`;
  }
  return "p";
};
