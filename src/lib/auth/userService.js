// src/lib/auth/userService.js
import prisma from "@/lib/prisma";

/**
 * Найти пользователя по ID
 */
export async function findUserById(id) {
  return await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      login: true,
      nickname: true,
      avatarUrl: true,
      tags: true,
      email: true,
    },
  });
}

/**
 * Найти пользователя по логину
 */
export async function findUserByLogin(login) {
  return await prisma.user.findUnique({
    where: { login },
  });
}

/**
 * Найти пользователя по email
 */
export async function findUserByEmail(email) {
  return await prisma.user.findUnique({
    where: { email },
  });
}

/**
 * Создать нового пользователя
 */
export async function createUser({ login, email, name, avatarUrl }) {
  return await prisma.user.create({
    data: {
      login,
      email,
      nickname: name || "Anonymous",
      avatarUrl: avatarUrl || "/unset_avatar.jpg",
      password: "", // для OAuth пустой
    },
  });
}

/**
 * Найти Account по провайдеру
 */
export async function findAccount(provider, providerId) {
  return await prisma.account.findUnique({
    where: {
      provider_providerId: {
        provider,
        providerId,
      },
    },
    include: { user: true },
  });
}

/**
 * Создать Account для пользователя
 */
export async function createAccount({ provider, providerId, userId }) {
  return await prisma.account.create({
    data: {
      provider,
      providerId,
      userId,
    },
  });
}
