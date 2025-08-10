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
 * Создать нового пользователя с защитой от гонок через транзакцию
 */
export async function createUserSafe({ login, name, image }) {
  return await prisma.$transaction(async (tx) => {
    let existingUser = await tx.user.findUnique({
      where: { login },
    })

    if (existingUser) {
      return existingUser
    }

    return await tx.user.create({
      data: {
        login,
        nickname: name || "Anonymous",
        avatarUrl: image || "/avatars/unset_avatar.jpg",
        password: "",
        tags: [],
      },
    })
  })
}
