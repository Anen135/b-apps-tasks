import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/authOptions"
import prisma from "@/lib/prisma"
import { deleteImage } from '@/lib/imageService'

export async function GET(req) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user?.id) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      login: true,
      nickname: true,
      avatarUrl: true,
      color: true,
      tags: true,
      createdAt: true,
    },
  })

  if (!user) {
    return new Response(JSON.stringify({ error: "User not found" }), { status: 404 })
  }

  return Response.json(user)
}

export async function DELETE(req) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user?.id) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { avatarUrl: true },
  })

  if (!user) {
    return new Response(JSON.stringify({ error: "User not found" }), { status: 404 })
  }

  try {
    if (user.avatarUrl) {
      // из avatarUrl типа "/avatars/filename.png" нужно вытащить filename.png
      const filename = user.avatarUrl.split("/").pop()
      await deleteImage(filename)
    }

    await prisma.user.delete({ where: { id: session.user.id } })
    return Response.json({ success: true })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }
}