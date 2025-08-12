// src/app/api/users/me/tasks/route.js
import { getCurrentUser } from "@/lib/auth/getCurrentUser"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 })
    const tasks = await prisma.task.findMany({
      where: { userId: user.id },
      include: { column: true },
    })

    return Response.json(tasks)
  } catch (error) {
    console.error("Ошибка API /my-tasks:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
