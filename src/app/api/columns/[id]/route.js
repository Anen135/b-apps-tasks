import prisma from '@/src/lib/prisma'

export async function GET(_, { params }) {
  const column = await prisma.column.findUnique({
    where: { id: params.id },
    include: { tasks: true }
  })
  return Response.json(column)
}

export async function PUT(req, { params }) {
  const data = await req.json()
  const updated = await prisma.column.update({
    where: { id: params.id },
    data: { title: data.title }
  })
  return Response.json(updated)
}

export async function DELETE(_, { params }) {
  await prisma.column.delete({
    where: { id: params.id }
  })
  return Response.json({ success: true })
}
