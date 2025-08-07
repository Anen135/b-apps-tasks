// src/app/api/columns/route.js
import prisma from '@/lib/prisma'

export async function GET() {
  const columns = await prisma.column.findMany({
    include: { tasks: true }
  })
  return Response.json(columns)
}

export async function POST(req) {
  const data = await req.json()
  const column = await prisma.column.create({
    data: {
      title: data.title,
      color: data.color,
    }
  })
  return Response.json(column)
}
