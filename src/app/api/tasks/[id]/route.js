import prisma from '@/src/lib/prisma'

export async function GET(_, { params }) {
  const task = await prisma.task.findUnique({
    where: { id: params.id }
  })
  return Response.json(task)
}

export async function PUT(req, { params }) {
  const data = await req.json()
  const updated = await prisma.task.update({
    where: { id: params.id },
    data: {
      content: data.content,
      position: data.position,
      columnId: data.columnId
    }
  })
  return Response.json(updated)
}

export async function DELETE(_, { params }) {
  await prisma.task.delete({
    where: { id: params.id }
  })
  return Response.json({ success: true })
}
