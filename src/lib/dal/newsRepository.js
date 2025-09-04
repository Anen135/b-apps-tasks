// src/dal/newsRepository.js
import { BaseRepository } from '@/lib/dal/baseRepository';
import prisma from '@/lib/prisma';

export class NewsRepository extends BaseRepository {
  constructor() {
    super('news');
  }

  async listTrending({ limit = 10 } = {}) {
    return prisma.news.findMany({
      where: { trending: true },
      orderBy: { createdAt: 'desc' },
      take: limit
    });
  }

  async search({ q, category, tags, page = 1, perPage = 20 }) {
    const where = {};
    if (q) {
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { excerpt: { contains: q, mode: 'insensitive' } }
      ];
    }
    if (category) where.category = category;
    if (Array.isArray(tags) && tags.length) where.tags = { hasEvery: tags };

    const skip = (page - 1) * perPage;
    const [total, data] = await Promise.all([
      prisma.news.count({ where }),
      prisma.news.findMany({ where, skip, take: perPage, orderBy: { createdAt: 'desc' } })
    ]);
    return { meta: { total, page, perPage }, data };
  }
}
