import prisma from "@/lib/prisma"

/**
 * Найти пользователя по логину (GitHub login)
 */
export async function findUserByLogin(login) {
  return await prisma.user.findUnique({
    where: { login },
  })
}

/**
 * Создать нового пользователя
 */
export async function createUser({ login, name, image }) {
  return await prisma.user.create({
    data: {
      login,
      nickname: name || "Anonymous",
      avatarUrl: image || "/avatars/unset_avatar.jpg",
      password: "",
      tags: [],
    },
  })
}
