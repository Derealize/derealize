import { extendTheme, theme } from '@chakra-ui/react'
// console.log(theme)

const fontsans =
  '-apple-system, BlinkMacSystemFont, Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;'
const fontmono = '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, "Ubuntu Mono", monospace;'

// https://chakra-ui.com/docs/theming/theme
const mytheme = extendTheme({
  sizes: {
    p33: '33.3%',
    p25: '25%',
  },
  fonts: {
    body: fontsans,
    heading: fontsans,
    mono: fontmono,
  },
  colors: {
    blue: {
      50: '#00ffff',
    },
    brand: {
      900: '#1a365d',
      800: '#153e75',
      700: '#2a69ac',
    },
    agray: {
      100: '#718096',
    },
  },
})

export default mytheme

// export default {
//   breakpoints: ["30em", "48em", "62em", "80em"],
//   fonts: {
//     heading: '"Avenir Next", sans-serif',
//     body: "system-ui, sans-serif",
//     mono: "Menlo, monospace",
//   },
//   fontSizes: {
//     xs: "0.75rem",
//     sm: "0.875rem",
//     md: "1rem",
//     lg: "1.125rem",
//     xl: "1.25rem",
//     "2xl": "1.5rem",
//     "3xl": "1.875rem",
//     "4xl": "2.25rem",
//     "5xl": "3rem",
//     "6xl": "4rem",
//   },
// };
