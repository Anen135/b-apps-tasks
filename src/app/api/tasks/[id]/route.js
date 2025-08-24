// src/app/api/tasks/[id]/route.js
import prisma from '@/lib/prisma'

export async function GET(_, { params }) {
  const { id } = await params
  const task = await prisma.task.findUnique({ where: { id } })
  if (!task) return Response.json({ error: 'Task not found' }, { status: 404 })
  return Response.json(task)
}

export async function PUT(req, { params }) {
  const { id } = await params
  const data = await req.json()

  try {
    const updated = await prisma.task.update({
      where: { id },
      data: {
        content: data.content,
        position: data.position,
        color: data.color,
        tags: data.tags,
        assignees: data.assignees,
        column: {
          connect: { id: data.columnId }
        }
      }
    })
    return Response.json(updated)
  } catch (error) {
    if (error.code === 'P2025') return Response.json({ error: 'Task not found' }, { status: 404 })
    console.error('Error updating task:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(_, { params }) {
  const { id } = await params
  try {
    await prisma.task.delete({ where: { id } })
    return Response.json({ success: true })
  } catch (error) {
    if (error.code === 'P2025') return Response.json({ error: 'Task not found' }, { status: 404 })
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}