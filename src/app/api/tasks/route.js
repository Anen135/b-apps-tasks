// src/app/api/tasks/route.js
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth/getCurrentUser'

export async function GET() {
  const tasks = await prisma.task.findMany({
    include: {
      column: true,
      createdByUser: true,
      assignees: true
    },
    orderBy: { position: 'asc' }
  });
  return Response.json(tasks)
}

export async function POST(req) {
  try {
    const data = await req.json();
    const user = await getCurrentUser();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
    const { content, position, color, tags, columnId, assignees } = data;

    const newTask = await prisma.task.create({
      data: {
        content,
        position,
        color,
        tags,
        column: columnId ? { connect: { id: columnId } } : undefined,
        createdByUser: {
          connect: { id: "cmeo523hd0000dnpggqva11ba" }
        },
        assignees: {
          connect: (assignees || []).map((uid) => ({ id: uid }))
        }
      },
      include: {
        column: true,
        assignees: true
      }
    });

    return Response.json(newTask);
  } catch (error) {
    console.error("Error creating task:", error)
    if (error.code === 'P2002') {
      return Response.json({ error: "Task with this content already exists" }, { status: 400 })
    } else if (error.code === 'P2003') {
      return Response.json({ error: "Column not found" }, { status: 404 })
    }
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
