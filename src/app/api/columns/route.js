// src/app/api/columns/route.js
import prisma from '@/lib/prisma'

export async function GET() {
  const columns = await prisma.column.findMany({ include: { tasks: true } })
  return Response.json(columns)
}

export async function POST(req) {
  const data = await req.json()
  try {
    const column = await prisma.column.create({
      data: {
        title: data.title,
        color: data.color,
      }
    })
    return Response.json(column)
  } catch (error) {
    console.error("Error creating column:", error)
    if (error.code === 'P2002') return Response.json({ error: "Column with this title already exists" }, { status: 400 })
    else if (error.code === 'P2003') return Response.json({ error: "Column not found" }, { status: 404 })
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
