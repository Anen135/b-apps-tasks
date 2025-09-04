// src/dal/accountRepository.js
import { BaseRepository } from '@/lib/dal/baseRepository';
import prisma from '@/lib/prisma'

export class AccountRepository extends BaseRepository {
  constructor() {
    super('account');
  }

  async findByProvider(provider, providerId) {
    return prisma.account.findUnique({ where: { provider_providerId: { provider, providerId } } });
  }

  async attachAccountToUser({ provider, providerId, userId }) {
    return prisma.account.upsert({
      where: { provider_providerId: { provider, providerId } },
      create: { provider, providerId, userId },
      update: { userId }
    });
  }
}
