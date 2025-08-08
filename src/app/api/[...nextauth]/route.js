// /pages/api/auth/[...nextauth].ts
import NextAuth from "next-auth"
import GitHubProvider from "next-auth/providers/github"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

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
  async signIn({ user, account, profile }) {
    const githubLogin = profile.login
    const githubEmail = profile.email // может быть null
    const avatar = profile.avatar_url

    const existing = await prisma.user.findUnique({
      where: { login: githubLogin },
    })

    if (!existing) {
      await prisma.user.create({
        data: {
          login: githubLogin,
          email: githubEmail,
          nickname: profile.name || githubLogin,
          avatarUrl: avatar || "avatars/unset_avatar.jpg",
          password: "", // необязательно, если нет ручной регистрации
          tags: [],
        },
      })
    }

    return true
  },

  async jwt({ token, user, profile }) {
    if (profile?.login) {
      token.login = profile.login
    }
    return token
  },

  async session({ session, token }) {
    session.user.login = token.login
    return session
  }
},
  secret: process.env.NEXTAUTH_SECRET,
}

export default NextAuth(authOptions)
