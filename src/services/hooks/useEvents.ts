import {useQuery} from 'react-query'

export type Event = {
  id: string
  name: string
  additional_details: string
  description: string
  date: string
  users: {
    id: string
    name: string
    value: number
    confirmed: boolean
    itens: string[]
  }[]
}

async function getEvents(): Promise<Event[]> {
  const response = await fetch('/api/events', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  return response.json()
}

export function useEvents() {
  return useQuery(['event'], () => getEvents(), {
    staleTime: 1000 * 60 * 10,
  })
}
