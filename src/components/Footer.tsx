import {Flex} from '@chakra-ui/react'
import logo from '../assets/trinca.svg'
import Image from 'next/image'

export function Footer() {
  return (
    <Flex justifyContent="center" alignItems="center" py={8}>
      <Image src={logo} alt="Logo Trinca" />
    </Flex>
  )
}
