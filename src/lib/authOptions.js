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
      let existingUser = await findUserByLogin(user.login)

      if (!existingUser) {
        existingUser = await createUser({
          login: user.login,
          name: user.name,
          image: user.image,
          email: user.email,
        })
      }
      user.id = existingUser.id
      user.tags = existingUser.tags || []

      return true
    },

    async jwt({ token, user }) {
      // Если юзер только что вошёл
      if (user) {
        token.sub = user.id;
        token.login = user.login;
        token.tags = user.tags || [];
        return token;
      }

      // Если update() вызван позже — подгружаем актуальные данные из БД
      if (token.sub) {
        const dbUser = await findUserByLogin(token.login);
        if (dbUser) {
          token.login = dbUser.login;
          token.tags = dbUser.tags || [];
        }
      }

      return token;
    },


    async session({ session, token }) {
      session.user.id = token.sub
      session.user.login = token.login
      session.user.tags = token.tags || []
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}
