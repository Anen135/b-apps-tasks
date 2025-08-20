// src/app/api/columns/tasks/route.js
import prisma from '@/lib/prisma'

export async function GET() {
  const columns = await prisma.column.findMany({ include: { tasks: true } })
  return Response.json(columns)
}