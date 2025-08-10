// src/app/api/tasks/my-tasks/route.js
import { getCurrentUser } from "@/lib/auth/getCurrentUser"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const user = await getCurrentUser()

    const tasks = await prisma.task.findMany({
      where: { userId: user.id },
      include: { column: true },
    })

    return new Response(JSON.stringify(tasks), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Ошибка API /my-tasks:", error)
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
