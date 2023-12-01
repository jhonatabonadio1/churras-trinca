import {Flex, SimpleGrid} from '@chakra-ui/react'
import {Header} from '../../components/Header'
import {Footer} from '../../components/Footer'
import {getSession} from 'next-auth/react'

import {Card} from '../../components/Card'
import {AddCard} from '../../components/AddCard'
import {useEvents} from '../../services/hooks/useEvents'

function Events() {
  const {data, isFetching} = useEvents()
  return (
    <Flex
      w="100%"
      h="full"
      minH="100vh"
      gap="4"
      flexDir="column"
      mx="auto"
      maxW={900}
      bg="#FAFAFA">
      <Header />

      <Flex flex="1" zIndex={2} flexDir="column" mt={-20} mx={12}>
        <SimpleGrid
          gridTemplateColumns={['1fr', '1fr', '1fr 1fr']}
          gridAutoFlow={['dense', 'dense', 'dense']}
          gap={8}>
          {!isFetching &&
            data.map((event) => <Card data={event} key={event.id} />)}
          <AddCard />
        </SimpleGrid>
      </Flex>

      <Footer />
    </Flex>
  )
}

export async function getServerSideProps(context) {
  const session = await getSession(context)

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  return {
    props: {
      user: session.user,
    },
  }
}

export default Events
