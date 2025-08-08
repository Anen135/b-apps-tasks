// lib/auth.ts
import GitHubProvider from "next-auth/providers/github"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import { NextAuthOptions } from "next-auth"

export const authOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user }) {
      const existing = await prisma.user.findUnique({
        where: { login: user.email },
      })

      if (!existing) {
        await prisma.user.create({
          data: {
            login: user.email,
            nickname: user.name || "Anonymous",
            avatarUrl: user.image || "avatars/unset_avatar.jpg",
            password: "",
            tags: [],
          },
        })
      }

      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token.login = user.email
      }
      return token
    },
    async session({ session, token }) {
      session.user.login = token.login
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}
