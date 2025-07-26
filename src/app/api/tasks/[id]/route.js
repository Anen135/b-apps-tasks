import prisma from '@/lib/prisma'

export async function GET(_, { params }) {
  const { id } = await params
  const task = await prisma.task.findUnique({
    where: { id }
  })

  if (!task) {
    return new Response(JSON.stringify({ error: 'Task not found' }), {
      status: 404
    })
  }

  return Response.json(task)
}

export async function PUT(req, { params }) {
  const { id } = await params
  const data = await req.json()

  const existing = await prisma.task.findUnique({ where: { id } })
  if (!existing) {
    return new Response(JSON.stringify({ error: 'Task not found' }), {
      status: 404
    })
  }

  const updated = await prisma.task.update({
    where: { id },
    data: {
      content: data.content,
      position: data.position,
      columnId: data.columnId
    }
  })
  return Response.json(updated)
}

export async function DELETE(_, { params }) {
  const { id } = await params

  const existing = await prisma.task.findUnique({ where: { id } })
  if (!existing) {
    return new Response(JSON.stringify({ error: 'Task not found' }), {
      status: 404
    })
  }

  await prisma.task.delete({ where: { id } })
  return Response.json({ success: true })
}