import {ChakraProvider} from '@chakra-ui/react'
import {theme} from '../styles/theme'
import {SessionProvider} from 'next-auth/react'
import {QueryClientProvider} from 'react-query'
import {queryClient} from '../services/queryClient'

function MyApp({Component, pageProps: {session, ...pageProps}}) {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={session}>
        <title>Churras Trinca</title>
        <ChakraProvider theme={theme}>
          <Component {...pageProps} />
        </ChakraProvider>
      </SessionProvider>
    </QueryClientProvider>
  )
}

export default MyApp
