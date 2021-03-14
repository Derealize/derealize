import { extendTheme, theme } from '@chakra-ui/react'

// console.log(theme) // generate theme.default.json

const fontsans =
  '-apple-system, BlinkMacSystemFont, Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;'
const fontmono = '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, "Ubuntu Mono", monospace;'

const BarIconButton = {
  baseStyle: ({ colorMode }: Record<string, any>) => ({
    // bg: 'transparent',
    borderRadius: 'full',
    m: 1,
    color: 'gray.600',
    _hover: {
      bg: colorMode === 'dark' ? 'gray.700' : 'gray.100',
    },
  }),
}

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
  components: {
    BarIconButton,
  },
})

export default mytheme
