import type {NextApiRequest, NextApiResponse} from 'next'

import prisma from '../../../lib/db'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'GET') {
    const fetchEvents = await prisma.event.findMany({
      include: {
        users: true,
      },
    })

    return res.status(200).json(fetchEvents)
  } else {
    return res.status(500).json({error: 'Ocorreu um problema interno.'})
  }
}
