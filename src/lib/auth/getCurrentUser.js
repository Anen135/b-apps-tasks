// src/lib/auth/getCurrentUser.js
// sourcery skip: use-braces
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"
import prisma from "@/lib/prisma"

/**
 * Возвращает текущего пользователя из базы.
 * Сначала проверяет JWT через NextAuth, потом грузит свежие данные из Prisma.
 * Если авторизация не пройдена — вернёт null.
 */
export async function getCurrentUser() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.login) return null

  return prisma.user.findUnique({
    where: { login: session.user.login },
  })
}
