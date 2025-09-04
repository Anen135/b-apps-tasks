// src/dal/columnRepository.js
import { BaseRepository } from '@/lib/dal/baseRepository';
import prisma from '@/lib/prisma';

export class ColumnRepository extends BaseRepository {
  constructor() {
    super('column'); // prisma model is "column" lowercase access
  }

  // create column with optional initial tasks
  async createWithTasks(data = {}) {
    // data: { title, color, createdBy, tasks: [{title, position, ...}] }
    const { tasks, ...rest } = data;
    const createData = { ...rest };
    if (Array.isArray(tasks) && tasks.length) {
      createData.tasks = { create: tasks };
    }
    return prisma.column.create({ data: createData, include: { tasks: true } });
  }

  // get column with tasks ordered by position
  async findByIdWithTasks(id) {
    return prisma.column.findUnique({
      where: { id },
      include: {
        tasks: {
          orderBy: { position: 'asc' }
        }
      }
    });
  }

  // simple search by title
  async searchByTitle(q, { limit = 20 } = {}) {
    if (!q) return [];
    return prisma.column.findMany({
      where: { title: { contains: q, mode: 'insensitive' } },
      take: limit
    });
  }
}
