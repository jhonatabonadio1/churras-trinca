import {PrismaAdapter} from '@next-auth/prisma-adapter'
import NextAuth, {NextAuthOptions} from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import prisma from '../../../lib/db'
import {compare} from 'bcrypt'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {label: 'Login', type: 'email', placeholder: 'e-mail'},
        password: {label: 'Senha', type: 'password', placeholder: 'senha'},
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const {email, password} = credentials

        const findUser = await prisma.user.findUnique({where: {email}})

        if (!findUser) {
          return null
        }

        const passDecrypted = await compare(password, findUser.password)

        if (!passDecrypted) {
          return null
        }

        return {
          id: findUser.id,
          email: findUser.email,
          name: findUser.name,
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async jwt({token, user}) {
      if (user) {
        return {
          ...token,
          name: user.name,
        }
      }
      return token
    },
    async session({token, session}) {
      return {
        ...session,
        user: {
          ...session.user,
          name: token.name,
        },
      }
    },
  },
}

export default NextAuth(authOptions)
