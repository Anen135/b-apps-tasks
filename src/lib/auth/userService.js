import prisma from "@/lib/prisma"
import { downloadImage } from "@/lib/imageService"

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
export async function createUser({ login, name, image }) {
  return await prisma.$transaction(async (tx) => {
    let existingUser = await tx.user.findUnique({ where: { login } })

    if (existingUser) {
      return existingUser
    }

    let avatarUrl = '/avatars/unset_avatar.jpg'
    if (image) {
      // формируем имя файла, например, по логину
      const filename = `${login}.jpg`
      avatarUrl = await downloadImage(image, filename)
    }

    return await tx.user.create({
      data: {
        login,
        nickname: name || "Anonymous",
        avatarUrl,
        password: "",
        tags: [],
      },
    })
  })
}
