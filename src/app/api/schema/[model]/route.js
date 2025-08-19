import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Список доступных моделей (чтобы не дернуть что-то лишнее)
const models = {
  User: prisma.user,
  Post: prisma.post,
};

export async function GET(req, { params }) {
  const { model } = params;
  if (!models[model]) return NextResponse.json({ error: "Unknown model" }, { status: 400 });
  const data = await (models)[model].findMany();
  return NextResponse.json(data);
}

export async function PUT(req, { params }) {
  const { model } = params;
  if (!models[model]) return NextResponse.json({ error: "Unknown model" }, { status: 400 });

  const body = await req.json();
  if (!body.id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const updated = await (models)[model].update({
    where: { id: body.id },
    data: body,
  });

  return NextResponse.json(updated);
}
