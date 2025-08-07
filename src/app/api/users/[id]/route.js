// src/app/api/users/[id]/route.js
import prisma from '@/lib/prisma'

export async function GET(_, context) {
  const { id } = await context.params

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      login: true,
      nickname: true,
      avatarUrl: true,
      color: true,
      tags: true,
      createdAt: true
    }
  })

  if (!user) {
    return Response.json({ error: 'User not found' }, { status: 404 })
  }

  return Response.json(user)
}
