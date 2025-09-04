// src/dal/taskRepository.js
import { BaseRepository } from '@/lib/dal/baseRepository';
import prisma from '@/lib/prisma';
import { NotFoundError } from '@/utils/errors';

export class TaskRepository extends BaseRepository {
  constructor() {
    super('task');
  }

  // create task in column; automatically sets position (append to end if position not provided)
  async createInColumn({ title = 'New Task', columnId, position, createdBy, content, color, deadline, tags = [] }) {
    if (!Array.isArray(tags)) tags = [];

    // compute position: if not provided, append to end
    if (typeof position !== 'number') {
      const maxPos = await prisma.task.findFirst({
        where: { columnId },
        orderBy: { position: 'desc' },
        select: { position: true }
      });
      position = maxPos ? maxPos.position + 1 : 0;
    } else {
      // if inserting in the middle, shift others
      await prisma.task.updateMany({
        where: { columnId, position: { gte: position } },
        data: { position: { increment: 1 } }
      });
    }

    return prisma.task.create({
      data: { title, columnId, position, createdBy, content, color, deadline, tags }
    });
  }

  async findByIdWithRelations(id) {
    const res = await prisma.task.findUnique({
      where: { id },
      include: {
        column: true,
        assignees: true,
        createdByUser: true
      }
    });
    if (!res) throw new NotFoundError('Task', { id });
    return res;
  }

  // move a task to another column and position (transactional)
  async moveTask({ taskId, toColumnId, toPosition = undefined }) {
    return prisma.$transaction(async (tx) => {
      const task = await tx.task.findUnique({ where: { id: taskId } });
      if (!task) throw new NotFoundError('Task', { id: taskId });

      // remove gap from old column (decrement positions greater than task.position)
      await tx.task.updateMany({
        where: { columnId: task.columnId, position: { gt: task.position } },
        data: { position: { decrement: 1 } }
      });

      // compute insertion position for new column
      let insertPos;
      if (typeof toPosition === 'number') {
        insertPos = toPosition;
        await tx.task.updateMany({
          where: { columnId: toColumnId, position: { gte: insertPos } },
          data: { position: { increment: 1 } }
        });
      } else {
        // append
        const last = await tx.task.findFirst({
          where: { columnId: toColumnId },
          orderBy: { position: 'desc' },
          select: { position: true }
        });
        insertPos = last ? last.position + 1 : 0;
      }

      return await tx.task.update({
        where: { id: taskId },
        data: { columnId: toColumnId, position: insertPos }
      });
    });
  }

  // reorder tasks within the same column (transactional)
  async reorderWithinColumn({ columnId, fromPosition, toPosition }) {
    if (typeof fromPosition !== 'number' || typeof toPosition !== 'number') {
      throw new Error('fromPosition and toPosition must be numbers');
    }
    if (fromPosition === toPosition) return;

    return prisma.$transaction(async (tx) => {
      const moving = await tx.task.findFirst({
        where: { columnId, position: fromPosition }
      });
      if (!moving) throw new NotFoundError('Task at position', { columnId, fromPosition });

      if (fromPosition < toPosition) {
        // shift up tasks between (fromPosition+1..toPosition) by -1
        await tx.task.updateMany({
          where: { columnId, position: { gt: fromPosition, lte: toPosition } },
          data: { position: { decrement: 1 } }
        });
      } else {
        await tx.task.updateMany({
          where: { columnId, position: { gte: toPosition, lt: fromPosition } },
          data: { position: { increment: 1 } }
        });
      }

      await tx.task.update({
        where: { id: moving.id },
        data: { position: toPosition }
      });

      return tx.task.findMany({ where: { columnId }, orderBy: { position: 'asc' } });
    });
  }

  // assign/unassign user to task
  async addAssignee(taskId, userId) {
    return prisma.task.update({
      where: { id: taskId },
      data: { assignees: { connect: { id: userId } } },
      include: { assignees: true }
    });
  }

  async removeAssignee(taskId, userId) {
    return prisma.task.update({
      where: { id: taskId },
      data: { assignees: { disconnect: { id: userId } } },
      include: { assignees: true }
    });
  }

  // search tasks by tag or text
  async search({ text, tag, columnId, limit = 50 }) {
    const where = {};
    if (text) {
      where.OR = [
        { title: { contains: text, mode: 'insensitive' } },
        { content: { contains: text, mode: 'insensitive' } }
      ];
    }
    if (tag) {
      where.tags = { has: tag };
    }
    if (columnId) where.columnId = columnId;
    return prisma.task.findMany({ where, take: limit, orderBy: { position: 'asc' } });
  }
}
