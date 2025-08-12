// src/app/api/tasks/route.js
import prisma from '@/lib/prisma'

export async function GET() {
  const tasks = await prisma.task.findMany()
  return Response.json(tasks)
}

export async function POST(req) {
  const data = await req.json()
  try {
    const task = await prisma.task.create({
      data: {
        content: data.content,
        position: data.position,
        columnId: data.columnId,
        color: data.color,
        tags: data.tags ?? [],
        userId: data.userId ?? null,
      }
    })
    return Response.json(task)
  } catch (error) {
    console.error("Error creating task:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
