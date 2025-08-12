// src/app/api/columns/[id]/route.js
import prisma from '@/lib/prisma'

export async function GET(_, { params }) {
  const { id } = await params
  const column = await prisma.column.findUnique({
    where: { id },
    include: { tasks: true }
  })

  if (!column) return new Response(JSON.stringify({ error: 'Column not found' }), { status: 404 })
  return Response.json(column)
}

export async function PUT(req, { params }) {
  const { id } = await params
  const data = await req.json()

  const existing = await prisma.column.findUnique({ where: { id } })
  if (!existing) return new Response(JSON.stringify({ error: 'Column not found' }), { status: 404 })

  try {
    const updated = await prisma.column.update({
      where: { id },
      data: {
        title: data.title,
        color: data.color
      }
    })
    return Response.json(updated)
  } catch (err) {
    if (err.code === 'P2025') console.error('Column not found')
    else console.error('Unexpected error:', err)
    return Response.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(_, { params }) {
  const { id } = await params

  const existing = await prisma.column.findUnique({ where: { id } })
  if (!existing) return new Response(JSON.stringify({ error: 'Column not found' }), { status: 404 })

  try {
    await prisma.column.delete({ where: { id } })
    return Response.json({ success: true })
  } catch (error) {
    console.error('Error deleting column:', error)
    if (error.code === 'P2025') return Response.json({ success: false, error: 'Column not found' }, { status: 404 })
    return Response.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
