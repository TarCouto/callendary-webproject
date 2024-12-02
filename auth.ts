import { PrismaAdapter } from '@/lib/auth/prisma-adpter'
import { prisma } from '@/lib/prisma'
import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
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
  callbacks: {
    // Inclui o campo `picture` do perfil do Google no token JWT
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.picture = profile.picture // Adiciona a imagem do Google ao token
      }
      return token
    },
    // Inclui o campo `picture` na sessão
    async session({ session, token }) {
      // Apenas adiciona a imagem ao `session.user` sem sobrescrever outros dados
      session.user.image = token.picture
      return session
    },
  },
})
