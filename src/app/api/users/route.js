// src/app/api/users/route.js
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function GET() {
  const users = await prisma.user.findMany()
  return Response.json(users)
}

export async function POST(req) {
  const body = await req.json();
  const { login, password, nickname, tags = [], color } = body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: {
        login,
        password: hashedPassword,
        nickname,
        tags,
        color,
      },
    });
    return Response.json(user);
  } catch (error) {
    if (error.code === 'P2002') return Response.json({ error: 'User with this login already exists' }, { status: 400 });
    return Response.json({ error: error.message }, { status: 400 });
  }
}