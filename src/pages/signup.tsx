import {Flex, Link, useToast} from '@chakra-ui/react'
import {Header} from '../components/Header'
import {Footer} from '../components/Footer'
import * as yup from 'yup'
import {yupResolver} from '@hookform/resolvers/yup'
import {SubmitHandler, useForm} from 'react-hook-form'
import {Input} from '../components/Input'
import {Button} from '../components/Button'
import NextLink from 'next/link'
import {useRouter} from 'next/router'

interface SignUpFormData {
  name: string
  email: string
  password: string
}

const signUpFormSchema = yup.object().shape({
  name: yup.string().required('Nome e sobrenome não informado'),
  email: yup.string().required('E-mail obrigatório').email('E-mail inválido'),
  password: yup
    .string()
    .required('Senha não informada')
    .min(6, 'Digite ao menos 6 letras ou números'),
})

function SignIn() {
  const router = useRouter()
  const toast = useToast()

  const {register, handleSubmit, formState} = useForm({
    resolver: yupResolver(signUpFormSchema),
  })

  const handleSignUp: SubmitHandler<SignUpFormData> = async (values) => {
    const response = await fetch('/api/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: values.email,
        name: values.name,
        password: values.password,
      }),
    })

    if (response.ok) {
      router.push('/')
      toast({
        title: 'Conta criada com sucesso!',
        description: 'Faça o login para acessar o aplicativo.',
        status: 'success',
      })
    } else {
      const data = await response.json()
      if (data.error) {
        toast({
          title: 'Ocorreu um problema.',
          description: data.error,
          status: 'error',
        })
      } else {
        toast({
          title: 'Ocorreu um problema.',
          description: 'Não foi possível criar a conta.',
          status: 'error',
        })
      }
    }
  }

  return (
    <Flex w="100%" h="100vh" gap="4" flexDir="column" mx="auto" maxW={900}>
      <Header smooth />

      <Flex
        as="form"
        flex="1"
        flexDir="column"
        gap={8}
        onSubmit={handleSubmit(handleSignUp)}
        w={['60%', '60%', '40%']}
        mx="auto"
        zIndex={2}
        mt={-40}>
        <Input
          label="Nome"
          placeholder="nome completo"
          type="text"
          {...register('name')}
          error={formState.errors.name}
        />

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
          text="Cadastre-se"
          type="submit"
          enabled
          isLoading={formState.isLoading}
        />
        <Flex justifyContent="center" alignItems="center" fontWeight="semibold">
          <Link
            as={NextLink}
            href="/"
            textAlign="center"
            _hover={{
              opacity: 0.7,
            }}>
            Fazer login
          </Link>
        </Flex>
      </Flex>
      <Footer />
    </Flex>
  )
}

export default SignIn
