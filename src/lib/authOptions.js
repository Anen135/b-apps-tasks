// /lib/authOptions.js
import GitHub from "next-auth/providers/github"
import prisma from "@/lib/prisma"

export const authOptions = {
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          login: profile.login,
          email: profile.email,
          image: profile.avatar_url,
        }
      },
    }),
  ],
    session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 дней в секундах
    updateAge: 24 * 60 * 60,   // (необязательно) обновлять токен раз в 24 часа
    },

  callbacks: {
    async signIn({ user }) {
      const existingUser = await prisma.user.findUnique({
        where: { login: user.login },
      })

      if (!existingUser) {
        await prisma.user.create({
          data: {
            login: user.login,
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
      if (user) token.login = user.login
      return token
    },
    async session({ session, token }) {
      session.user.login = token.login
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}
