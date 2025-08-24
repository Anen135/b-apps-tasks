// src/app/api/users/[id]/tasks/route.js
import prisma from '@/lib/prisma'

export async function GET(_, context) {
  const { id } = await context.params
  try {
    const tasks = await prisma.task.findMany({
      where: {
        assignees: {
          some: {
            id: id
          }
        }
      },
      orderBy: {
        position: 'asc'
      },
      include: {
        column: true,
        createdByUser: true
      }
    })
    return Response.json(tasks)
  } catch (error) {
    console.error('Error fetching tasks:', error)
    if (error.code === 'P2025') return Response.json({ error: 'User not found' }, { status: 404 })
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }

}
