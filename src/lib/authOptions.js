// src/lib/authOptions.js
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import {
  findUserByLogin,
  findUserByEmail,
  createUser,
  findAccount,
  createAccount,
  findUserById,
} from "@/lib/auth/userService";

export const authOptions = {
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),

    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    Credentials({
      name: "Credentials",
      credentials: {
        login: { label: "Login", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.login || !credentials?.password) return null;

        const user = await findUserByLogin(credentials.login);
        if (!user) return null;

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;

        return user;
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },

  callbacks: {
    async signIn({ user, account, profile }) {
      if (account.provider === "credentials") {
        return true; // уже проверено authorize()
      }

      const {provider} = account;
      const providerId = account.providerAccountId;

      // Найти Account
      let dbAccount = await findAccount(provider, providerId);
      if (dbAccount) {
        user.id = dbAccount.userId;
        return true;
      }

      // Если нет Account, ищем по email
      let dbUser = null;
      if (profile.email) {
        dbUser = await findUserByEmail(profile.email);
      }

      if (!dbUser) {
        dbUser = await createUser({
          login: profile.login || profile.email || `${provider}_${providerId}`,
          email: profile.email,
          name: profile.name,
          avatarUrl: profile.image,
        });
      }

      await createAccount({ provider, providerId, userId: dbUser.id });
      user.id = dbUser.id;

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.roles = user.tags;
      }
      return token;
    },

    async session({ session, token }) {
      const dbUser = await findUserById(token.sub);
      if (dbUser) {
        session.user = dbUser;
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};
