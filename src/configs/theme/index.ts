// theme/index.tsx
import { extendTheme } from "@chakra-ui/react";
import resolveConfig from "tailwindcss/resolveConfig";

import tailwindConfig from "../../../tailwind.config";

const tailwind = resolveConfig(tailwindConfig) || { theme: {} };
const { theme = {} } = tailwind;

const styleOverrides = {
  colors: theme.colors,
  fontWeights: theme.fontWeight,
  spacing: theme.spacing,
  fontSizes: theme.fontSize,
  sizes: theme.sizes,
  breakpoints: theme.screens,
  fonts: {
    heading: (theme?.fontFamily?.sans as []).join(", "),
    body: (theme?.fontFamily?.sans as []).join(", "),
    mono: (theme?.fontFamily?.sans as []).join(", "),
  },
};

const componentOverrides = {
  components: {
    Button: {
      defaultProps: {
        size: "lg",
        colorScheme: "blue.03",
        // _hover: {
        //   backgroundColor: "red",
        // },
      },
      baseStyle: {
        borderRadius: "xl",
        lineHeight: "inherit",
      },
      sizes: {
        lg: {
          fontSize: "md",
        },
        xl: {
          h: 14,
        },
      },
    },
    Checkbox: {
      baseStyle: {
        control: {
          color: "primary.03",
        },
      },
    },
    Modal: {
      baseStyle: {
        dialogContainer: {
          px: 4,
        },
      },
    },
    Input: {
      sizes: {
        xl: {
          field: {
            h: 14,
            fontSize: "base",
            lineHeight: 1.4,
          },
          addon: {
            h: 14,
            fontSize: "base",
            lineHeight: 1.4,
          },
        },
      },
    },
  },
};
export default extendTheme({ ...styleOverrides });
