import type {NextApiRequest, NextApiResponse} from 'next'

import prisma from '../../../lib/db'

interface Users {
  id: string
  name: string
  value: string
  itens: string[]
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    try {
      const {name, date, description, additional_details} = req.body
      const users: Users[] = req.body.users

      const createEvent = await prisma.event.create({
        data: {
          name,
          description,
          additional_details,
          date: new Date(date),
        },
      })

      if (createEvent) {
        for (const user of users) {
          await prisma.participation.create({
            data: {
              user: {
                connect: {
                  id: user.id,
                },
              },
              itens: JSON.stringify(user.itens),
              value: parseFloat(user.value),
              event: {
                connect: {
                  id: createEvent.id,
                },
              },
            },
          })
        }
      }

      const findEvent = await prisma.event.findUnique({
        where: {
          id: createEvent.id,
        },
        include: {
          users: true,
        },
      })

      return res.status(200).json(findEvent)
    } catch (err) {
      return res.status(400).json({error: err})
    }
  }

  if (req.method === 'GET') {
    try {
      const {eventId} = req.query
      console.log('ID capturado:', eventId)
      const findEvent = await prisma.event.findUnique({
        where: {
          id: parseInt(eventId as string),
        },
      })

      if (!findEvent) {
        return res.status(400).json({error: 'Evento não encontrado'})
      }

      const findUsers = await prisma.participation.findMany({
        where: {
          event: {
            id: findEvent.id,
          },
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      })

      const users = []

      for (const user of findUsers) {
        users.push({
          id: user.id,
          name: user.user.name,
          value: user.value,
          confirmed: user.confirmed,
          itens: JSON.parse(user.itens),
        })
      }

      return res.status(200).json({
        ...findEvent,
        users,
      })
    } catch (err) {
      return res.status(400).json({error: err})
    }
  }

  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(500).json({error: 'Ocorreu um problema interno.'})
  }
}
