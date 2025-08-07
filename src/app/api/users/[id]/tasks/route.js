// src/app/api/users/[id]/tasks/route.js
import prisma from '@/lib/prisma'

export async function GET(_, context) {
  const { id } = await context.params

  const tasks = await prisma.task.findMany({
    where: { userId: id }
  })

  return Response.json(tasks)
}
