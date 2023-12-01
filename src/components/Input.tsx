import {
  Input as ChakraInput,
  FormControl,
  FormLabel,
  InputProps as ChakraInputProps,
  FormErrorMessage,
} from '@chakra-ui/react'
import {ForwardRefRenderFunction, forwardRef} from 'react'
import {FieldError} from 'react-hook-form'

interface InputProps extends ChakraInputProps {
  label?: string
  error?: FieldError
}

const InputBase: ForwardRefRenderFunction<HTMLInputElement, InputProps> = (
  {label, error, ...rest},
  ref,
) => {
  return (
    <FormControl isInvalid={!!error}>
      {label && (
        <FormLabel fontWeight="bold" mb={4} fontSize="lg">
          {label}
        </FormLabel>
      )}
      <ChakraInput
        bg="white"
        fontStyle="italic"
        py={6}
        shadow={'lg'}
        _focus={{
          shadow: 'lg',
        }}
        rounded="3"
        border="none"
        _placeholder={{
          color: 'black',
        }}
        {...rest}
        ref={ref}
      />

      {!!error && <FormErrorMessage>{error.message}</FormErrorMessage>}
    </FormControl>
  )
}

export const Input = forwardRef(InputBase)
