import {
  Flex,
  FormControl,
  SimpleGrid,
  Text,
  VStack,
  useToast,
} from '@chakra-ui/react'
import {Header} from '../../components/Header'
import {Footer} from '../../components/Footer'
import {getSession} from 'next-auth/react'
import {Input} from '../../components/Input'
import {Button} from '../../components/Button'
import {User} from '../../components/User'

import AsyncSelect from 'react-select/async'
import Select, {MultiValue} from 'react-select'
import {User as UserProps} from '@prisma/client'
import {useState} from 'react'

import {NumericFormat} from 'react-number-format'
import {churrasItens} from '../../utils/itens'

import * as yup from 'yup'
import {SubmitHandler, useForm} from 'react-hook-form'
import {yupResolver} from '@hookform/resolvers/yup'
import {useRouter} from 'next/router'
import {queryClient} from '../../services/queryClient'

interface SelectProps {
  label: string
  value: string
}

interface UsersData {
  id: string
  name: string
  value: number
  confirmed: boolean
  itens: string[]
}

interface EventFormData {
  name: string
  date: string
  description?: string
  additional_details?: string
}

const eventFormSchema = yup.object().shape({
  name: yup.string().required('Nome é obrigatório'),
  date: yup.string().required('Data é obrigatório'),
  description: yup.string(),
  additional_details: yup.string(),
})

function Create() {
  const toast = useToast()
  const router = useRouter()

  const {register, handleSubmit, formState} = useForm({
    resolver: yupResolver(eventFormSchema),
  })

  const [defaultOptions, setDefaultOptions] = useState<SelectProps[]>(
    [] as SelectProps[],
  )

  const [users, setUsers] = useState<UsersData[]>([] as UsersData[])

  const [selectedUser, setSelectedUser] = useState<SelectProps>(
    null as SelectProps,
  )
  const [selectedAmount, setSelectedAmount] = useState(0)
  const [selectedItens, setSelectedItens] = useState<MultiValue<SelectProps>>(
    [] as MultiValue<SelectProps>,
  )

  const [isLoading, setIsLoading] = useState(false)

  function calculaSugestao() {
    let sugestaoPreco = 0
    for (const itemSelected of selectedItens) {
      const findItens = churrasItens.find(
        (item) => item.value === itemSelected.value,
      )

      if (findItens) {
        sugestaoPreco += findItens.price
      }
    }

    return sugestaoPreco.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
  }

  const handleCreateEvent: SubmitHandler<EventFormData> = async (values) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: values.name,
          date: values.date,
          description: values.description,
          additional_details: values.additional_details,
          users,
        }),
      })

      if (response.ok) {
        queryClient.invalidateQueries('event')
        router.push('/events')
        toast({
          title: 'Evento criado',
          description: 'O evento foi criado com sucesso!',
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
    } catch (err) {
      toast({
        title: 'Ocorreu um problema.',
        description: 'Não foi possível criar a conta.',
        status: 'error',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const loadOptions = async (inputValue?: string) => {
    try {
      const response = await fetch(`/api/users?q=${inputValue || ''}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await response.json()

      const options = data.map((user: UserProps) => ({
        value: user.id,
        label: user.name,
      }))

      setDefaultOptions(options)

      return options
    } catch (error) {
      console.error('Error fetching users:', error)
      return []
    }
  }

  const handleAddUser = () => {
    if (!selectedUser) {
      return toast({
        title: 'Não foi possível adicionar.',
        description: 'Selecione um usuário para adicionar.',
        status: 'error',
      })
    }
    if (!selectedAmount) {
      return toast({
        title: 'Não foi possível adicionar.',
        description: 'O valor de contribuição é obrigatório.',
        status: 'error',
      })
    }

    if (!selectedItens || selectedItens.length < 0) {
      return toast({
        title: 'Não foi possível adicionar.',
        description: 'Os itens de contribuição é obrigatório.',
        status: 'error',
      })
    }

    const alreadyAddedUser = users.find(
      (user) => user.id === selectedUser.value,
    )

    if (alreadyAddedUser) {
      return toast({
        title: 'Não foi possível adicionar.',
        description: 'Usuário já adicionado.',
        status: 'error',
      })
    }

    const itens = []

    for (const item of selectedItens) {
      itens.push(item.value)
    }

    const user = {
      id: selectedUser.value,
      name: selectedUser.label,
      value: selectedAmount,
      confirmed: false,
      itens,
    }

    setSelectedAmount(0)
    setSelectedUser(null)
    setSelectedItens(null)

    toast({
      title: 'Usuário adicionado.',
      description:
        selectedUser.label.split(' ')[0] + ' foi adicionado(a) à lista.',
      status: 'success',
    })

    setUsers([...users, user])
  }

  function removeUser(id: string, name: string) {
    const newUtsersList = users.filter((user) => user.id !== id)
    setUsers(newUtsersList)

    toast({
      title: 'Usuário removido.',
      description: name.split(' ')[0] + ' foi removido(a) da lista.',
      status: 'error',
    })
  }

  function handleEditValue(value: number, index: number) {
    const updatedUsers = [...users]

    const actualValue = updatedUsers[index].value

    if (actualValue !== value) {
      updatedUsers[index].value = value
      setUsers(updatedUsers)
      toast({
        title: 'Valor editado.',
        description:
          'O valor de contribuição de ' +
          updatedUsers[index].name.split(' ')[0] +
          ' foi editado.',
        status: 'success',
      })
    }
  }

  function calculaTotal() {
    let total = 0
    if (users.length > 0) {
      for (const user of users) {
        total += user.value
      }
    }

    return total.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
  }

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
        <VStack as="form" gap={8} onSubmit={handleSubmit(handleCreateEvent)}>
          <SimpleGrid
            gridTemplateColumns={['1fr', '1fr', '1fr 1fr']}
            gap={8}
            w="full">
            <Input
              label="Nome"
              placeholder="Nome do evento"
              {...register('name')}
              error={formState.errors.name}
            />
            <Input
              label="Data"
              type="date"
              {...register('date')}
              error={formState.errors.date}
            />
          </SimpleGrid>

          <Input
            label="Descrição"
            type="text"
            placeholder="Descrição do evento"
            {...register('description')}
            error={formState.errors.description}
          />

          <Input
            label="Observações adicionais"
            type="text"
            placeholder="Observarções adicionais (opcional)"
            {...register('additional_details')}
            error={formState.errors.additional_details}
          />

          <Flex w="full" flexDir="column">
            <Text fontWeight="bold" mb={4} fontSize="lg">
              Adicionar participantes
            </Text>

            <VStack w="full" gap={8}>
              <Flex gap={8} w="full" flexDir={['column', 'column', 'row']}>
                <FormControl>
                  <AsyncSelect
                    placeholder="Nome do participante"
                    cacheOptions
                    isClearable
                    defaultOptions={defaultOptions}
                    onFocus={() => loadOptions()}
                    value={selectedUser}
                    loadOptions={loadOptions}
                    onChange={(option) => setSelectedUser(option)}
                    styles={{
                      control: (baseStyles) => ({
                        ...baseStyles,
                        border: 'none',
                        paddingTop: 6,
                        paddingBottom: 6,
                        borderRadius: 3,
                        backgroundColor: 'white',
                        color: 'black',
                        fontStyle: 'italic',
                        paddingRight: 6,
                        paddingLeft: 6,
                        boxShadow:
                          '0 10px 15px -3px rgba(0, 0, 0, 0.1),0 4px 6px -2px rgba(0, 0, 0, 0.05);',
                      }),
                      placeholder: (defaultStyles) => {
                        return {
                          ...defaultStyles,
                          color: 'black',
                        }
                      },
                    }}
                  />
                </FormControl>

                <Flex flexDir="column" w="full">
                  <NumericFormat
                    placeholder="Valor"
                    thousandSeparator="."
                    decimalSeparator=","
                    prefix={'R$ '}
                    decimalScale={2}
                    value={selectedAmount}
                    customInput={Input}
                    onValueChange={({value}) =>
                      setSelectedAmount(parseFloat(value))
                    }
                  />
                  {selectedItens.length > 0 && (
                    <Text mt="1" fontStyle="italic">
                      Valor sugerido: {calculaSugestao()}
                    </Text>
                  )}
                </Flex>
              </Flex>
              <Flex w="full" gap={8}>
                <FormControl>
                  <Select
                    placeholder="Itens"
                    onFocus={() => loadOptions()}
                    value={selectedItens}
                    options={churrasItens}
                    isMulti
                    onChange={(selectedOptions) =>
                      setSelectedItens(selectedOptions)
                    }
                    styles={{
                      control: (baseStyles) => ({
                        ...baseStyles,
                        border: 'none',
                        paddingTop: 6,
                        paddingBottom: 6,
                        borderRadius: 3,
                        backgroundColor: 'white',
                        placeholderTextColor: 'black',
                        color: 'black',
                        fontStyle: 'italic',
                        paddingRight: 6,
                        paddingLeft: 6,
                        boxShadow:
                          '0 10px 15px -3px rgba(0, 0, 0, 0.1),0 4px 6px -2px rgba(0, 0, 0, 0.05);',
                      }),
                      placeholder: (defaultStyles) => {
                        return {
                          ...defaultStyles,
                          color: 'black',
                        }
                      },
                    }}
                  />
                </FormControl>
                <FormControl flex="1" display="flex" justifyContent="flex-end">
                  <Button
                    text="Adicionar"
                    enabled
                    type="button"
                    action={() => handleAddUser()}
                  />
                </FormControl>
              </Flex>
            </VStack>
          </Flex>

          <Flex w="full" flexDir="column" bg="white" p={4} shadow="xl">
            <Text fontWeight="bold" mb={4} fontSize="lg">
              Participantes
            </Text>
            {users.length > 0 ? (
              users.map((user, index) => (
                <User
                  key={user.id}
                  data={user}
                  staticItem
                  onRemove={() => removeUser(user.id, user.name)}
                  onEditValue={(value) => handleEditValue(value, index)}
                />
              ))
            ) : (
              <Flex>
                <Text>Nenhum participante adicionado.</Text>
              </Flex>
            )}
          </Flex>

          <Flex justifyContent="flex-end" alignItems="center" gap={4} w="full">
            <Text fontSize="lg" fontWeight="bold">
              Total: {calculaTotal()}
            </Text>
            <Button
              text="Criar evento"
              enabled={users.length > 0}
              type="submit"
              isLoading={isLoading}
            />
          </Flex>
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

export default Create
