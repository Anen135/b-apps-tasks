// src/dal/userRepository.js
import { BaseRepository } from '@/lib/dal/baseRepository';
import prisma from '@/lib/prisma';

export class UserRepository extends BaseRepository {
  constructor() {
    super('user');
  }

  async findByLogin(login) {
    return prisma.user.findUnique({ where: { login } });
  }

  async findByEmail(email) {
    if (!email) return null;
    return prisma.user.findUnique({ where: { email } });
  }

  // create user (password already hashed expected)
  async createUser(data) {
    // data: { login, password, avatarUrl?, color?, nickname?, email?, tags?, metadata? }
    if (!data?.login) throw new Error('login required');
    if (!data?.password) throw new Error('password required');
    return prisma.user.create({ data });
  }

  // cautious delete - ensures cleaning relations optionally
  async deleteUserAndOrphanData(userId, { deleteTasks = false } = {}) {
    return prisma.$transaction(async (tx) => {
      if (deleteTasks) {
        await tx.task.deleteMany({ where: { createdBy: userId } });
        await tx.column.deleteMany({ where: { createdBy: userId } });
        // optionally other cleanup
      } else {
        // detach createdBy
        await tx.task.updateMany({ where: { createdBy: userId }, data: { createdBy: null } });
        await tx.column.updateMany({ where: { createdBy: userId }, data: { createdBy: null } });
      }
      await tx.account.deleteMany({ where: { userId } });
      return await tx.user.delete({ where: { id: userId } });
    });
  }

  // list with pagination
  async list({ page = 1, perPage = 20 } = {}) {
    const { skip, take } = { skip: (page - 1) * perPage, take: perPage };
    const [total, data] = await Promise.all([
      prisma.user.count(),
      prisma.user.findMany({ skip, take, orderBy: { createdAt: 'desc' }, select: { id: true, login: true, avatarUrl: true, nickname: true, createdAt: true } })
    ]);
    return { meta: { total, page, perPage }, data };
  }

  // simple authentication helper (expect hashed password compare done elsewhere)
}
