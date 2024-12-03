import { PrismaAdapter } from '@/lib/auth/prisma-adpter'
import { prisma } from '@/lib/prisma'
import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma), // Conecta o Prisma Adapter ao banco
  providers: [Google],
})
