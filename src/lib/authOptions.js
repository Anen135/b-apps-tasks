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
  createUserWithAccount
} from "@/lib/auth/userService";

/**
 * Генерация уникального логина
 */
async function generateUniqueLogin(baseLogin) {
  let login = baseLogin;
  let counter = 1;

  while (await findUserByLogin(login)) {
    login = `${baseLogin}-${counter++}`;
  }

  return login;
}

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

      const { provider } = account;
      const providerId = account.providerAccountId;

      // Найти Account
      let dbAccount = await findAccount(provider, providerId);
      if (dbAccount) {
        user.id = dbAccount.userId;
        return true;
      }

      // Если нет Account → создаем в транзакции
      const login = await generateUniqueLogin(profile.login || profile.email?.split("@")[0] || `${provider}_${providerAccountId}`);
      const { user: dbUser } = await createUserWithAccount({
        provider,
        providerAccountId,
        login,
        email: profile.email,
        name: profile.name,
        avatarUrl: profile.image,
      });
      user.id = dbUser.id;
      user.tags = dbUser.tags;

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        // Первый вызов (user есть) → тянем юзера из БД по email
        const dbUser = await findUserByEmail(user.email);
        if (dbUser) {
          token.sub = dbUser.id;
          token.login = dbUser.login;
          token.tags = dbUser.tags;
          token.picture = dbUser.avatarUrl;
          token.name = dbUser.nickname;
          token.email = dbUser.email;
        }
      }
      return token;
    },

    async session({ session, token }) {
      session.user = {
        id: token.sub,
        login: token.login,
        tags: token.tags,
        avatarUrl: token.picture,
        nickname: token.name,
        email: token.email,
      };
      return session;
    }
  },

  secret: process.env.NEXTAUTH_SECRET,
};
