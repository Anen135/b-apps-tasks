import prisma from '@/lib/prisma'

export async function GET() {
  const tasks = await prisma.task.findMany()
  return Response.json(tasks)
}

export async function POST(req) {
  const data = await req.json()
  const task = await prisma.task.create({
    data: {
      content: data.content,
      position: data.position,
      columnId: data.columnId
    }
  })
  return Response.json(task)
}
