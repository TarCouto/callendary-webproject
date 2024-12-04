import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import { PrismaAdapter } from '@/lib/auth/prisma-adpter'
import { prisma } from '@/lib/prisma'

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma), // Conecta ao Prisma Adapter
  providers: [
    Google({
      authorization: {
        params: {
          scope: 'openid email profile',
          prompt: 'consent',
        },
      },
    }),
  ],
})
