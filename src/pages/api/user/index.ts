import type {NextApiRequest, NextApiResponse} from 'next'
import {hash} from 'bcrypt'
import prisma from '../../../lib/db'

// Exclude keys from user
function exclude<User, Key extends keyof User>(
  user: User,
  keys: Key[],
): Omit<User, Key> {
  const userCopy = {...user}
  keys.forEach((key) => delete userCopy[key])
  return userCopy
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    try {
      const {name, email, password} = req.body

      const findUser = await prisma.user.findUnique({where: {email}})

      if (findUser) {
        return res.status(400).json({error: 'Usuário já existente.'})
      }

      const passwordEncrypted = await hash(password, 8)

      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: passwordEncrypted,
        },
      })

      const userWithoutPassword = exclude(user, ['password'])

      if (userWithoutPassword) {
        res.status(200).json(userWithoutPassword)
      }
    } catch (err) {
      throw new Error('err')
    }
  } else {
    return res.status(500).json({error: 'Ocorreu um problema interno.'})
  }
}
