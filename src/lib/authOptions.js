// src/lib/authOptions.js
import GitHub from "next-auth/providers/github"
import { findUserByLogin, createUser } from "@/lib/auth/userService"

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
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  callbacks: {
    async signIn({ user }) {
      const existingUser = await findUserByLogin(user.login)

      if (!existingUser) {
        await createUser({
          login: user.login,
          name: user.name,
          image: user.image,
        })
      }

      return true
    },
    async jwt({ token, user }) {
      if (user) {
        const dbUser = await findUserByLogin(user.login)
        token.id = dbUser.id
        token.login = dbUser.login
        token.tags = dbUser.tags
      }
      return token
    },
    async session({ session, token }) {
      session.user.id = token.id
      session.user.login = token.login
      session.user.tags = token.tags
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}
