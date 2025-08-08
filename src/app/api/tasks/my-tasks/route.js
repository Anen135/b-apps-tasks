import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"
import prisma from "@/lib/prisma"

export async function GET(req) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.login) {
    return new Response(JSON.stringify({ error: "Unauthorized", userSession: session }), {
      status: 401,
    })
  }

  const user = await prisma.user.findUnique({
    where: { login: session.user.login },
    select: { id: true },
  })

  if (!user) {
    return new Response(JSON.stringify({ error: "User not found" }), {
      status: 404,
    })
  }

  const tasks = await prisma.task.findMany({
    where: { userId: user.id },
    include: { column: true },
  })

  return new Response(JSON.stringify(tasks), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  })
}
