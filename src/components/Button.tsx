import {Button as ChakraButton, Spinner} from '@chakra-ui/react'

interface Props {
  text: string
  action?: () => void
  enabled: boolean
  isLoading?: boolean
  type: 'button' | 'submit' | 'reset'
}

export function Button({text, action, enabled, type, isLoading}: Props) {
  return (
    <ChakraButton
      bgColor="black"
      _hover={{
        bg: 'black',
      }}
      onClick={action}
      type={type}
      isDisabled={!enabled || isLoading}
      opacity={!enabled || isLoading ? 0.7 : 1}
      color="white"
      fontWeight="bold"
      rounded="16"
      w="full"
      py={6}>
      {isLoading ? <Spinner /> : text}
    </ChakraButton>
  )
}
