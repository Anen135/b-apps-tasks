// src/dal/transactions.js
import prisma from '@/lib/prisma';
/**
 * Создать колонку и сразу несколько тасков в ней (атомарно).
 */
export async function createColumnWithTasks({ columnData, tasks = [] }) {
  return prisma.column.create({
    data: {
      ...columnData,
      tasks: tasks.length ? { create: tasks } : undefined
    },
    include: { tasks: true }
  });
}
