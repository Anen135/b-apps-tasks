// /app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import prisma from "@/lib/prisma"

export const authOptions = {
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user }) {
      const existingUser = await prisma.user.findUnique({
        where: { login: user.email },
      })

      if (!existingUser) {
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

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
