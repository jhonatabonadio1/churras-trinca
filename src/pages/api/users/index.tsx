import type {NextApiRequest, NextApiResponse} from 'next'

import prisma from '../../../lib/db'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'GET') {
    const {q} = req.query

    console.log(q)

    if (q.length > 0) {
      const fetchUsers = await prisma.user.findMany({
        where: {
          name: {
            contains: q.toString(),
            mode: 'insensitive',
          },
        },
      })

      return res.status(200).json(fetchUsers)
    }

    const fetchUsers = await prisma.user.findMany()

    return res.status(200).json(fetchUsers)
  } else {
    return res.status(500).json({error: 'Ocorreu um problema interno.'})
  }
}
