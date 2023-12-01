import {
  Box,
  Button as ChakraButton,
  Input as ChakraInput,
  Flex,
  HStack,
  Icon,
  IconButton,
  Text,
} from '@chakra-ui/react'
import {useState} from 'react'
import {
  FaCheck,
  FaCircle,
  FaPencilAlt,
  FaRegCircle,
  FaTimes,
} from 'react-icons/fa'
import {NumericFormat} from 'react-number-format'
import {queryClient} from '../services/queryClient'

interface Props {
  data: {
    id: string
    name: string
    confirmed: boolean
    value: number
    itens: string[]
  }
  staticItem?: boolean
  onRemove?: () => void
  onEditValue?: (value: number) => void
}

export function User({data, staticItem, onRemove, onEditValue}: Props) {
  const [checked, setChecked] = useState(data.confirmed)
  const [editingValue, setEditingValue] = useState(false)

  const [amount, setAmount] = useState(data.value)

  function handleEdit() {
    onEditValue(amount)
    setEditingValue(!editingValue)
  }

  async function checkUser() {
    const response = await fetch('/api/confirm', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        participationId: data.id,
      }),
    })

    if (response.ok) {
      const isChecked = await response.json()

      setChecked(isChecked)
      queryClient.invalidateQueries('event')
    }
  }

  return !staticItem ? (
    <ChakraButton
      w="full"
      h="full"
      variant="unstyled"
      onClick={() => checkUser()}
      borderBottom="1px"
      rounded="none"
      borderBottomColor="yellow.500"
      pb={2}
      mb={2}>
      <HStack w="full" justifyContent="space-between" alignItems="center">
        <Flex alignItems="center" gap={3}>
          <Icon
            as={checked ? FaCircle : FaRegCircle}
            fontSize={20}
            color={checked ? 'yellow.500' : 'yellow.gold'}
          />
          <Flex flexDir="column">
            <Text fontWeight="bold">{data.name}</Text>
            <HStack justifyContent="flex-start" alignItems="flex-start">
              <Box>
                {data.itens.length > 0 &&
                  data.itens.map((item, index) => (
                    <Text as="span" key={item} fontStyle="italic" fontSize="xs">
                      {item}
                      {index < data.itens.length - 1 && ', '}
                    </Text>
                  ))}
              </Box>
            </HStack>
          </Flex>
        </Flex>
        <Text
          fontWeight="bold"
          fontSize="lg"
          textDecoration={checked ? 'line-through' : 'none'}>
          {data.value.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          })}
        </Text>
      </HStack>
    </ChakraButton>
  ) : (
    <HStack
      pb={2}
      mb={2}
      w="full"
      borderBottom="1px"
      borderBottomColor="yellow.500"
      justifyContent="space-between"
      alignItems="center">
      <Flex alignItems="center" gap={3}>
        <Flex flexDir="column">
          <Text fontWeight="bold">{data.name}</Text>

          <HStack justifyContent="flex-start" alignItems="flex-start">
            <Box>
              {data.itens.length > 0 &&
                data.itens.map((item, index) => (
                  <Text as="span" key={item} fontStyle="italic" fontSize="xs">
                    {item}
                    {index < data.itens.length - 1 && ', '}
                  </Text>
                ))}
            </Box>
          </HStack>
        </Flex>
      </Flex>
      <Flex alignItems="center" gap={3}>
        {!editingValue ? (
          <Text
            fontWeight="bold"
            fontSize="lg"
            textDecoration={checked ? 'line-through' : 'none'}>
            {data.value.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            })}
          </Text>
        ) : (
          <NumericFormat
            placeholder="Valor"
            thousandSeparator="."
            decimalSeparator=","
            prefix={'R$ '}
            autoFocus
            value={data.value}
            decimalScale={2}
            customInput={(props) => (
              <ChakraInput
                type="text"
                p={0}
                h="auto"
                px={2}
                {...props}
                size="md"
              />
            )}
            onValueChange={({value}) => setAmount(parseFloat(value))}
          />
        )}

        {!editingValue ? (
          <IconButton
            icon={<FaPencilAlt />}
            bg="blue.500"
            size="xs"
            onClick={() => setEditingValue(!editingValue)}
            colorScheme="blue"
            color="white"
            rounded="full"
            aria-label="Editar"
          />
        ) : (
          <IconButton
            icon={<FaCheck />}
            bg="green.500"
            size="xs"
            onClick={() => handleEdit()}
            colorScheme="green"
            color="white"
            rounded="full"
            aria-label="Salvar"
          />
        )}
        <IconButton
          icon={<FaTimes />}
          bg="red.500"
          size="xs"
          colorScheme="red"
          color="white"
          rounded="full"
          onClick={onRemove}
          aria-label="Remover"
        />
      </Flex>
    </HStack>
  )
}
