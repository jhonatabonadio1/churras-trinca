import type {NextApiRequest, NextApiResponse} from 'next'

import prisma from '../../../lib/db'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    try {
      const {participationId} = req.body

      const findParticipation = await prisma.participation.findUnique({
        where: {
          id: participationId,
        },
      })

      if (!findParticipation) {
        return res.status(400).json({error: 'Participante não encontrado.'})
      }

      const updateParticipation = await prisma.participation.update({
        where: {
          id: findParticipation.id,
        },
        data: {
          confirmed: !findParticipation.confirmed,
        },
      })

      return res.status(200).json(updateParticipation.confirmed)
    } catch (err) {
      return res.status(400).json({error: err})
    }
  }
  if (req.method !== 'POST') {
    return res.status(500).json({error: 'Ocorreu um problema interno.'})
  }
}
