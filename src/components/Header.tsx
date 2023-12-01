import {Flex, Text, IconButton} from '@chakra-ui/react'
import bg from '../assets/bg.svg'
import {FaChevronLeft, FaSignOutAlt} from 'react-icons/fa'
import {signOut, useSession} from 'next-auth/react'

import Router from 'next/router'

type Props = {
  smooth?: boolean
  goBack?: boolean
}

export function Header({smooth, goBack}: Props) {
  const {status, data} = useSession()

  return (
    <Flex
      bgImage={
        smooth
          ? `linear-gradient(to bottom, transparent 70%, yellow.500 100%), url(${bg.src})`
          : `url(${bg.src})`
      }
      bgColor="yellow.500"
      backgroundSize="cover"
      zIndex={1}
      backgroundPosition="center"
      minHeight={smooth ? '45vh' : '30vh'}
      alignItems={'flex-start'}
      width="100%"
      justifyContent="center">
      <Flex position="relative" w="full" mx={12} my={6}>
        {goBack && (
          <Flex
            bg="white"
            position="absolute"
            rounded="full"
            top={0}
            boxShadow="md"
            left={0}>
            <IconButton
              aria-label="Voltar"
              icon={<FaChevronLeft />}
              bg="white"
              rounded="full"
              onClick={() => {
                Router.push('/events')
              }}
            />
          </Flex>
        )}

        {status === 'authenticated' && (
          <Flex
            bg="white"
            position="absolute"
            rounded="full"
            top={0}
            boxShadow="md"
            right={0}
            pl={4}>
            <Flex pr={2} justifyContent="center" alignItems="center">
              <Text fontWeight="semibold" textTransform="capitalize">
                Olá, {data.user.name.split(' ')[0]} 👋
              </Text>
            </Flex>
            <IconButton
              aria-label="Sair"
              icon={<FaSignOutAlt />}
              bg="white"
              rounded="full"
              onClick={() => signOut()}
            />
          </Flex>
        )}

        <Flex
          w="full"
          mx="auto"
          pt={14}
          justifyContent="center"
          alignItems="center">
          <Text fontSize="4xl" fontWeight="800">
            Agenda de Churras
          </Text>
        </Flex>
      </Flex>
    </Flex>
  )
}
