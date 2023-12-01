import {Flex, HStack, Icon, Text, VStack} from '@chakra-ui/react'
import Link from 'next/link'
import {FaDollarSign, FaUsers} from 'react-icons/fa'
import {Event} from '../services/hooks/useEvents'
import {queryClient} from '../services/queryClient'

interface Props {
  data: Event
}

interface Users {
  id: string
  name: string
  value: number
  itens: string[]
}

export function Card({data}: Props) {
  function getTotalValue(users: Users[]) {
    let totalValue = 0

    for (const user of users) {
      totalValue += user.value
    }

    return totalValue.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
  }

  const dataEvento = new Date(data.date)

  const mes = dataEvento.getMonth() + 1
  const dia = dataEvento.getDate() + 1

  const diaFormatado = dia < 10 ? `0${dia}` : dia
  const mesFormatado = mes < 10 ? `0${mes}` : mes

  async function handlePrefetchUser(id: string) {
    await queryClient.prefetchQuery(
      ['event', id],
      async () => {
        const response = await fetch('/api/event?eventId=' + id, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        return response.json()
      },
      {
        staleTime: 1000 * 60 * 10, // 10 minutos
      },
    )
  }

  return (
    <Link href={'/events/' + data.id}>
      <VStack
        bg="white"
        onMouseEnter={() => handlePrefetchUser(data.id)}
        cursor="pointer"
        minH="225"
        boxShadow="xl"
        rounded="sm"
        _hover={{
          transform: 'scale(1.07)',
        }}
        transform="scale(1)"
        transition="all 0.2s"
        padding={6}
        gap={16}
        justifyContent="flex-start"
        alignItems="flex-start">
        <VStack flex="1" justifyContent="flex-start" alignItems="flex-start">
          <Text as="h1" fontSize="3xl" fontWeight="bold">
            {diaFormatado}/{mesFormatado}
          </Text>
          <Text fontSize="xl" fontWeight="semibold">
            {data.name}
          </Text>
        </VStack>

        <Flex flexDir="row" justifyContent="space-between" w="full">
          <HStack>
            <Icon as={FaUsers} color="yellow.500" fontSize="xl" />
            <Text fontSize="xl">{data.users.length}</Text>
          </HStack>
          <HStack>
            <Icon as={FaDollarSign} color="yellow.500" fontSize="xl" />
            <Text fontSize="xl">{getTotalValue(data.users)}</Text>
          </HStack>
        </Flex>
      </VStack>
    </Link>
  )
}
