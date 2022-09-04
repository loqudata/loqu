// 1. Import the extendTheme function
import { extendTheme, theme as defaultTheme } from "@chakra-ui/react";
// 2. Extend the theme to include custom colors, fonts, etc
const brandColors = {
  50: "#c0adea",
  100: "#b39ce6",
  200: "#a68ce2",
  300: "#997bdd",
  400: "#8d6bd9",
  500: "#805ad5",
  600: "#7351c0",
  700: "#6648aa",
  800: "#5a3f95",
  900: "#4d3680",
};
const colors = {
  brand: defaultTheme.colors.green,
  primary: defaultTheme.colors.green,
  secondary: defaultTheme.colors.blue,
  // brand: brandColors,
  // primary: brandColors
};
const f = "Inter";
export const theme = extendTheme({
  colors,
  fonts: {
    body: f,
    heading: f,
    serif: "Merriweather",
  },
  styles: {
    global: {
      // body: {
      //   bg: 'gray.50',
      //   color: 'gray.900',
      // },
      '.typography': {
        h2: {
          fontSize: '2xl',
          fontWeight: 'bold',
        },
        h3: {
          fontSize: 'lg'
        },
        h4: {
          fontSize: 'md'
        },
        ol: {
          marginInlineStart: "1rem"
        }
      }
    }
  }
});

export const responsivePadding = [3, null, 4, 6];
export const responsivePaddingY = [3, null, 4];
