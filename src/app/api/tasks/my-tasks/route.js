// app/api/my-tasks/route.ts
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth" // см. ниже
import prisma from "@/lib/prisma"

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.login) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { login: session.user.login },
    select: { id: true },
  })

  if (!user) {
    return Response.json({ error: "User not found" }, { status: 404 })
  }

  const tasks = await prisma.task.findMany({
    where: { userId: user.id },
    include: { column: true },
  })

  return Response.json(tasks)
}
