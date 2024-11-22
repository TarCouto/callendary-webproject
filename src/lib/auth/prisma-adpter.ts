import {
  Adapter,
  AdapterUser,
  AdapterSession,
  AdapterAccount,
} from '@auth/core/adapters'
import { prisma } from '../prisma'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { destroyCookie } from 'nookies'
import { NextApiRequest, NextApiResponse } from 'next'

export function PrismaAdapter(
  req: NextApiRequest,
  res: NextApiResponse,
): Adapter {
  return {
    async createUser(user: AdapterUser): Promise<AdapterUser> {
      const cookieStore = await cookies()
      const userId = cookieStore.get('userId')?.value

      if (!userId) {
        throw new Error('Cookie "userId" não encontrado.')
      }

      const existingUser = await prisma.user.findUnique({
        where: { id: userId },
      })

      if (!existingUser) {
        throw new Error('Usuário não encontrado com o ID fornecido no cookie.')
      }

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          name: user.name ?? existingUser.name,
          email: user.email ?? existingUser.email,
        },
      })

      destroyCookie({ res }, 'userId', {
        path: '/',
      })

      const response = NextResponse.next()
      console.log(
        'Tentando deletar o cookie "userId" com os seguintes parâmetros:',
        {
          name: 'userId',
          value: '',
          options: {
            path: '/',
            maxAge: 0,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
          },
        },
      )
      response.cookies.set('userId', '', {
        path: '/',
        maxAge: 0,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      })

      return {
        id: updatedUser.id,
        name: updatedUser.name,
        username: updatedUser.username ?? null,
        email: updatedUser.email!,
        avatar_url: updatedUser.avatar_url ?? '',
        emailVerified: null,
      }
    },

    async getUser(id: string): Promise<AdapterUser | null> {
      const user = await prisma.user.findUnique({
        where: { id },
      })

      if (!user) return null

      return {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email!,
        emailVerified: null,
        avatar_url: user.avatar_url ?? '',
      }
    },

    async getUserByEmail(email: string): Promise<AdapterUser | null> {
      const user = await prisma.user.findUnique({
        where: { email },
      })

      if (!user) return null

      return {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email!,
        emailVerified: null,
        avatar_url: user.avatar_url ?? '',
      }
    },

    async getUserByAccount({
      providerAccountId,
      provider,
    }: {
      providerAccountId: string
      provider: string
    }): Promise<AdapterUser | null> {
      const account = await prisma.account.findUnique({
        where: {
          provider_providerAccount_id: {
            provider,
            providerAccount_id: providerAccountId,
          },
        },
        include: { user: true },
      })

      if (!account || !account.user) return null

      const { user } = account

      return {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email!,
        emailVerified: null,
        avatar_url: user.avatar_url ?? '',
      }
    },

    async updateUser(user: AdapterUser): Promise<AdapterUser> {
      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: {
          name: user.name!,
          email: user.email,
        },
      })

      return {
        id: updatedUser.id,
        name: updatedUser.name,
        username: updatedUser.username,
        email: updatedUser.email!,
        emailVerified: null,
        avatar_url: updatedUser.avatar_url ?? '',
      }
    },

    async linkAccount(account: AdapterAccount): Promise<void> {
      await prisma.account.create({
        data: {
          user_id: account.userId,
          type: account.type,
          provider: account.provider,
          providerAccount_id: account.providerAccountId,
          refresh_token: account.refresh_token,
          access_token: account.access_token,
          expires_at: account.expires_at,
          token_type: account.token_type,
          scope: account.scope,
          id_token: account.id_token,
          session_state: account.session_state
            ? JSON.stringify(account.session_state)
            : null,
        },
      })
    },

    async createSession({
      sessionToken,
      userId,
      expires,
    }: {
      sessionToken: string
      userId: string
      expires: Date
    }): Promise<AdapterSession> {
      const session = await prisma.session.create({
        data: {
          user_id: userId,
          expires,
          session_token: sessionToken,
        },
      })

      return {
        sessionToken: session.session_token,
        userId: session.user_id,
        expires: session.expires,
      }
    },

    async getSessionAndUser(
      sessionToken: string,
    ): Promise<{ session: AdapterSession; user: AdapterUser } | null> {
      const sessionWithUser = await prisma.session.findUnique({
        where: { session_token: sessionToken },
        include: { user: true },
      })

      if (!sessionWithUser) return null

      const { user, ...session } = sessionWithUser

      return {
        session: {
          sessionToken: session.session_token,
          userId: session.user_id,
          expires: session.expires,
        },
        user: {
          id: user.id,
          name: user.name,
          username: user.username,
          email: user.email!,
          emailVerified: null,
          avatar_url: user.avatar_url ?? '',
        },
      }
    },

    async updateSession({
      sessionToken,
      userId,
      expires,
    }: {
      sessionToken: string
      userId: string
      expires: Date
    }): Promise<AdapterSession> {
      const session = await prisma.session.update({
        where: { session_token: sessionToken },
        data: {
          user_id: userId,
          expires,
        },
      })

      return {
        sessionToken: session.session_token,
        userId: session.user_id,
        expires: session.expires,
      }
    },

    async deleteSession(sessionToken: string): Promise<void> {
      await prisma.session.delete({
        where: { session_token: sessionToken },
      })
    },
  }
}
