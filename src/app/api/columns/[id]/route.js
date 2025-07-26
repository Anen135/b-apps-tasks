import prisma from '@/lib/prisma'

export async function GET(_, { params }) {
  const { id } = await params
  const column = await prisma.column.findUnique({
    where: { id },
    include: { tasks: true }
  })

  if (!column) {
    return new Response(JSON.stringify({ error: 'Column not found' }), {
      status: 404
    })
  }

  return Response.json(column)
}

export async function PUT(req, { params }) {
  const { id } = await params
  const data = await req.json()

  const existing = await prisma.column.findUnique({ where: { id } })
  if (!existing) {
    return new Response(JSON.stringify({ error: 'Column not found' }), {
      status: 404
    })
  }

  const updated = await prisma.column.update({
    where: { id },
    data: { title: data.title }
  })
  return Response.json(updated)
}

export async function DELETE(_, { params }) {
  const { id } = await params

  const existing = await prisma.column.findUnique({ where: { id } })
  if (!existing) {
    return new Response(JSON.stringify({ error: 'Column not found' }), {
      status: 404
    })
  }

  await prisma.column.delete({
    where: { id }
  })
  return Response.json({ success: true })
}
