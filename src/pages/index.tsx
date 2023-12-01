import {
  Flex,
  Link,
  Button as ChakraButton,
  Icon,
  Divider,
  Box,
  AbsoluteCenter,
  useToast,
} from '@chakra-ui/react'
import {Header} from '../components/Header'
import {Footer} from '../components/Footer'
import * as yup from 'yup'
import {yupResolver} from '@hookform/resolvers/yup'
import {SubmitHandler, useForm} from 'react-hook-form'
import {Input} from '../components/Input'
import {Button} from '../components/Button'

import {Icon as Iconify} from '@iconify/react'

import NextLink from 'next/link'
import {getSession, signIn} from 'next-auth/react'
import {useRouter} from 'next/router'

interface SignInFormData {
  email: string
  password: string
}

const signInFormSchema = yup.object().shape({
  email: yup.string().required('E-mail obrigatório').email('E-mail inválido'),
  password: yup
    .string()
    .required('Senha não informada')
    .min(6, 'Digite ao menos 6 letras ou números'),
})

function SignIn() {
  const router = useRouter()

  const {register, handleSubmit, formState} = useForm({
    resolver: yupResolver(signInFormSchema),
  })

  const toast = useToast()

  const handleSignIn: SubmitHandler<SignInFormData> = async (values) => {
    const signInData = await signIn('credentials', {
      email: values.email,
      password: values.password,
      redirect: false,
    })

    if (signInData?.error) {
      toast({
        title: 'Ocorreu um problema.',
        description: signInData?.error,
        status: 'error',
      })
    } else {
      toast({
        title: 'Login bem-sucedido',
        description: 'Seja bem-vindo(a)',
        status: 'success',
      })
      router.push('/events')
    }
  }

  async function SignInWithGoogle() {
    await signIn('google')
  }

  return (
    <Flex w="100%" h="100vh" gap="4" flexDir="column" mx="auto" maxW={900}>
      <Header smooth />

      <Flex
        as="form"
        flex="1"
        flexDir="column"
        zIndex={2}
        gap={8}
        onSubmit={handleSubmit(handleSignIn)}
        w={['60%', '60%', '40%']}
        mx="auto"
        mt={-40}>
        <Input
          label="Login"
          placeholder="e-mail"
          type="email"
          {...register('email')}
          error={formState.errors.email}
        />
        <Input
          label="Senha"
          placeholder="senha"
          type="password"
          {...register('password')}
          error={formState.errors.password}
        />
        <Button
          text="Entrar"
          type="submit"
          enabled
          isLoading={formState.isLoading}
        />
        <Box position="relative">
          <Divider borderColor="blackAlpha.300" />
          <AbsoluteCenter
            bg="yellow.500"
            px="4"
            color="black"
            fontWeight="medium">
            Ou
          </AbsoluteCenter>
        </Box>
        <Flex gap={2} flexDir="column">
          <ChakraButton
            bg="white"
            color="black"
            rounded="16"
            onClick={() => SignInWithGoogle()}
            py={6}
            leftIcon={
              <Icon as={Iconify} icon="devicon:google" color="red.500" />
            }>
            Fazer login com Google
          </ChakraButton>
        </Flex>
        <Flex justifyContent="center" alignItems="center" fontWeight="semibold">
          <Link
            as={NextLink}
            href="/signup"
            textAlign="center"
            _hover={{
              opacity: 0.7,
            }}>
            Criar conta
          </Link>
        </Flex>
      </Flex>
      <Footer />
    </Flex>
  )
}

export async function getServerSideProps(context) {
  const session = await getSession(context)

  if (session) {
    return {
      redirect: {
        destination: '/events',
        permanent: false,
      },
    }
  }

  return {
    props: {},
  }
}

export default SignIn
