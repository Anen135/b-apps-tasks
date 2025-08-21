// src/app/api/tasks/route.js
import prisma from '@/lib/prisma'
import { Columns } from 'lucide-react'

export async function GET() {
  const tasks = await prisma.task.findMany({ include: { column: true, user: true} })
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
    if (error.code === 'P2002') return Response.json({ error: "Task with this content already exists" }, { status: 400 })
    else if (error.code === 'P2003') return Response.json({ error: "Column not found" }, { status: 404 })
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
