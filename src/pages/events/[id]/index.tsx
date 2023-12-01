import {Flex, HStack, Icon, Spinner, Text, VStack} from '@chakra-ui/react'
import {Header} from '../../../components/Header'
import {Footer} from '../../../components/Footer'
import {getSession} from 'next-auth/react'
import {FaDollarSign, FaUsers} from 'react-icons/fa'
import {User} from '../../../components/User'
import {useRouter} from 'next/router'
import {useQuery} from 'react-query'

const fetchEvent = async (id: string | string[]) => {
  const response = await fetch('/api/event?eventId=' + id, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  return response.json()
}

interface UserData {
  id: string
  name: string
  value: number
  confirmed: boolean
  itens: string[]
}

function Event() {
  const router = useRouter()

  const {id} = router.query

  const {data, isFetching} = useQuery(['event', id], () => fetchEvent(id), {
    enabled: !!id,
    staleTime: 1000 * 60 * 10, // 10 minutos
  })
  function getTotalValue(users: UserData[]) {
    let totalValue = 0

    for (const user of users) {
      totalValue += user.value
    }

    return totalValue.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
  }

  const dataEvento = new Date(!isFetching && data.date)

  const mes = dataEvento.getMonth() + 1
  const dia = dataEvento.getDate() + 1

  const diaFormatado = dia < 10 ? `0${dia}` : dia
  const mesFormatado = mes < 10 ? `0${mes}` : mes

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
      <Header goBack />

      <Flex flex="1" zIndex={2} flexDir="column" mt={-20} mx={12}>
        <VStack
          bg="white"
          boxShadow="xl"
          rounded="sm"
          padding={6}
          gap={16}
          justifyContent="flex-start"
          alignItems="flex-start">
          {isFetching ? (
            <Flex w="full" h="full" justifyContent="center" alignItems="center">
              <Spinner />
            </Flex>
          ) : (
            <>
              <HStack
                alignItems="center"
                justifyContent="space-between"
                w="full">
                <VStack
                  flex="1"
                  justifyContent="flex-start"
                  alignItems="flex-start">
                  <Text as="h1" fontSize="3xl" fontWeight="bold">
                    {diaFormatado}/{mesFormatado}
                  </Text>
                  <Text fontSize="xl" fontWeight="semibold">
                    {data.name}
                  </Text>
                </VStack>
                <VStack justifyContent="flex-start" alignItems="flex-start">
                  <HStack>
                    <Icon as={FaUsers} color="yellow.500" fontSize="xl" />
                    <Text fontSize="xl">{data.users.length}</Text>
                  </HStack>
                  <HStack>
                    <Icon as={FaDollarSign} color="yellow.500" fontSize="xl" />
                    <Text fontSize="xl">{getTotalValue(data.users)}</Text>
                  </HStack>
                </VStack>
              </HStack>

              <VStack w="full">
                {data.users.map((user: UserData) => (
                  <User key={user.id} data={user} />
                ))}
              </VStack>
            </>
          )}
        </VStack>
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

export default Event
