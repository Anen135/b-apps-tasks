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
  const existingUser = await prisma.user.findUnique({ where: { login } });
  if (existingUser) {
    return existingUser;
  }
  let avatarUrl = '/unset_avatar.png';
  let filename;

  try {
    if (image) {
      filename = `${login}.jpg`;
      avatarUrl = await downloadImage(image, filename);
    }

    return await prisma.$transaction(async (tx) => {
      return await tx.user.create({
        data: {
          login,
          nickname: name || "Anonymous",
          avatarUrl,
          password: "",
          tags: [],
        },
      });
    });
  } catch (error) {
    // Удаляем файл, если он был скачан
    if (filename) {
      try {
        await fs.promises.unlink(`путь_к_аватаркам/${filename}`);
      } catch (unlinkError) {
        console.error('Ошибка удаления файла после неудачной транзакции:', unlinkError);
      }
    }
    throw error;
  }
}
