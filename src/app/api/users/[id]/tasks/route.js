// src/app/api/users/[id]/tasks/route.js
import prisma from '@/lib/prisma'

export async function GET(_, context) {
  const { id } = await context.params
  try {
    const tasks = await prisma.task.findMany({ where: { userId: id } }) 
    return Response.json(tasks)
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }

}
