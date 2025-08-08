// /pages/api/tasks/my-tasks.js
// sourcery skip: use-braces
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions)

  if (!session?.user?.login) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  const user = await prisma.user.findUnique({
    where: { login: session.user.login },
    select: { id: true },
  })

  if (!user) return res.status(404).json({ error: "User not found" })

  const tasks = await prisma.task.findMany({
    where: { userId: user.id },
    include: { column: true },
  })

  res.status(200).json(tasks)
}
