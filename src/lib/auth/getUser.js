// src/lib/auth/getUser.js
// sourcery skip: use-braces
import prisma from "@/lib/prisma"

/**
 * Получить пользователя по id или login.
 */
export async function getUser(identifier) {
  if (!identifier) return null

  const where =
    typeof identifier === "string" && identifier.includes("@")
      ? { email: identifier }
      : { id: identifier }

  return prisma.user.findUnique({ where })
}
