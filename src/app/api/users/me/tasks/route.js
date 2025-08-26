// src/app/api/users/me/tasks/route.js
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const tasks = await prisma.task.findMany({
      where: {
        assignees: { some: { id: user.id } }
      },
      orderBy: {
        position: "asc"
      },
      include: { column: true, assignees: true },
    });

    return Response.json(tasks);
  } catch (error) {
    console.error("Ошибка API /users/me/tasks:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const data = await req.json();
    const user = await getCurrentUser();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    // Проверяем, что задача принадлежит пользователю
    const existingTask = await prisma.task.findUnique({
      where: { id: data.id },
      select: { createdBy: true },
    });

    if (!existingTask) {
      return Response.json({ error: "Task not found" }, { status: 404 });
    }

    if (existingTask.createdBy !== user.id) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const updated = await prisma.task.update({
      where: { id: data.id },
      data: {
        content: data.content,
        position: data.position,
        columnId: data.columnId,
        color: data.color,
        tags: data.tags ?? [],
      },
      include: { column: true, assignees: true },
    });

    return Response.json(updated);
  } catch (error) {
    console.error("Ошибка PUT /users/me/tasks:", error);
    if (error.code === "P2025")
      return Response.json({ error: "Task not found" }, { status: 404 });
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
