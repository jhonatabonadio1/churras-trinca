import {extendTheme} from '@chakra-ui/react'

export const theme = extendTheme({
  colors: {
    yellow: {
      '500': '#FFD836',
      gold: '#998220',
    },
  },
  fonts: {
    header: 'Raleway',
    body: 'Raleway',
  },
  styles: {
    global: {
      body: {
        bg: 'yellow.500',
        color: 'black',
      },
    },
  },
})
