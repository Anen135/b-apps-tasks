// src/dal/baseRepository.js
import prisma from '@/lib/prisma';
import { NotFoundError } from '@/utils/errors';

export class BaseRepository {
  constructor(modelName) {
    if (!modelName) throw new Error('modelName required');
    this.modelName = modelName;
    this.client = prisma[this.modelName];
    if (!this.client) throw new Error(`Prisma model ${modelName} not found`);
  }

  // find by unique
  async findUnique(where, options = {}) {
    return await this.client.findUnique({ where, ...options });
  }

  async findFirst(where, options = {}) {
    return await this.client.findFirst({ where, ...options });
  }

  async findMany(query = {}) {
    return await this.client.findMany(query);
  }

  async count(where = {}) {
    return this.client.count({ where });
  }

  async create(data, options = {}) {
    return this.client.create({ data, ...options });
  }

  async update(where, data, options = {}) {
    try {
      return await this.client.update({ where, data, ...options });
    } catch (err) {
      // if update failed because not exists
      if (err.code === 'P2025') throw new NotFoundError(this.modelName, where);
      throw err;
    }
  }

  async delete(where, options = {}) {
    try {
      return await this.client.delete({ where, ...options });
    } catch (err) {
      if (err.code === 'P2025') throw new NotFoundError(this.modelName, where);
      throw err;
    }
  }

  // upsert helper
  async upsert({ where, create, update, options = {} }) {
    return this.client.upsert({ where, create, update, ...options });
  }
}
