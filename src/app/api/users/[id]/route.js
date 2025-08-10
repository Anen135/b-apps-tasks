// src/app/api/users/[id]/route.js
import prisma from '@/lib/prisma'
import { deleteImage } from '@/lib/imageService'

export async function GET(_, context) {
  const { id } = await context.params

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      login: true,
      nickname: true,
      avatarUrl: true,
      color: true,
      tags: true,
      createdAt: true
    }
  })

  if (!user) {
    return Response.json({ error: 'User not found' }, { status: 404 })
  }

  return Response.json(user)
}

export async function PUT(req, { params }) {
  const { id } = params
  const data = await req.json()

  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10)
  }

  try {
    const updated = await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        login: true,
        nickname: true,
        avatarUrl: true,
        color: true,
        tags: true,
        createdAt: true
      }
    })
    return Response.json(updated)
  } catch (error) {
    return Response.json({ error: error.message }, { status: 400 })
  }
}

export async function DELETE(_, { params }) {
  const { id } = await params;
  const user = await prisma.user.findUnique({
    where: { id },
    select: { avatarUrl: true }
  });

  if (!user) {
    return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
  }

  try {
    if (user.avatarUrl) {
      const filename = user.avatarUrl.split('/').pop();
      await deleteImage(filename);
    }

    await prisma.user.delete({ where: { id } });
    return Response.json({ success: true });

  } catch (error) {
    if (error.code === 'ENOENT') {
      if (filename) console.warn(`Failed to delete image ${filename}:`, error)
      try {
        await prisma.user.delete({ where: { id } });
        return Response.json({ success: true });
      } catch (dbError) {
        return new Response(JSON.stringify({ error: dbError.message }), { status: 500 });
      }
    }
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
