// src/app/api/users/route.js
import { metadata } from '@/app/layout';
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function GET(request) {
  const url = request.nextUrl;
  const search = url.searchParams.get('search')?.trim() || '';
  const limitParam = url.searchParams.get('limit');
  const limit = limitParam ? parseInt(limitParam, 10) : undefined;

  const where = search
    ? {
        OR: [
          { nickname: { contains: search, mode: 'insensitive' } },
          { login: { contains: search, mode: 'insensitive' } },
        ],
      }
    : {};

  const users = await prisma.user.findMany({
    where,
    take: limit ?? undefined,
    select: {
      id: true,
      login: true,
      nickname: true,
      avatarUrl: true,
      color: true,
      tags: true,
      createdAt: true,
      metadata: true,
    },
  });

  return Response.json(users);
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