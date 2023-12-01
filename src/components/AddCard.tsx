import {Box, Text, VStack} from '@chakra-ui/react'

import bbq from '../assets/bbq.svg'
import Image from 'next/image'
import Link from 'next/link'

export function AddCard() {
  return (
    <Link href="/events/create">
      <VStack
        bg="#F1F1F1"
        rounded="sm"
        padding={6}
        alignItems="center"
        _hover={{
          transform: 'scale(1.07)',
        }}
        transform="scale(1)"
        minH="225"
        transition="all 0.2s"
        cursor="pointer"
        justifyContent="center">
        <Box
          bg="yellow.500"
          w="20"
          h="20"
          display="flex"
          justifyContent="center"
          alignItems="center"
          rounded="full">
          <Image src={bbq} alt="Churras" />
        </Box>
        <Text as="h2" fontSize="xl" fontWeight="bold">
          Adicionar churras
        </Text>
      </VStack>
    </Link>
  )
}
