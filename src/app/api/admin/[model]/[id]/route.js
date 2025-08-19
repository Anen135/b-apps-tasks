// app/api/admin/[model]/[id]/route.js
import prisma from "@/lib/prisma";

function getModelClient(model) {
  const client = prisma[model];
  if (!client) throw new Error("ModelNotFound");
  return client;
}

export async function GET(req, { params }) {
  try {
    const {model, id} = params;
    const client = getModelClient(model);

    const item = await client.findUnique({ where: { id: isNaN(Number(id)) ? id : Number(id) } });
    if (!item) return new Response(null, { status: 404 });
    return new Response(JSON.stringify({ item }), { status: 200 });
  } catch (err) {
    console.error(err);
    if (err.message === "ModelNotFound") return new Response(JSON.stringify({ error: "Model not found" }), { status: 404 });
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const {model, id} = params;
    const client = getModelClient(model);

    const body = await req.json();
    const updated = await client.update({
      where: { id: isNaN(Number(id)) ? id : Number(id) },
      data: body,
    });
    return new Response(JSON.stringify({ item: updated }), { status: 200 });
  } catch (err) {
    console.error(err);
    if (err.message === "ModelNotFound") return new Response(JSON.stringify({ error: "Model not found" }), { status: 404 });
    return new Response(JSON.stringify({ error: err.message }), { status: 400 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const {model, id} = params;
    const client = getModelClient(model);

    await client.delete({ where: { id: isNaN(Number(id)) ? id : Number(id) } });
    return new Response(null, { status: 204 });
  } catch (err) {
    console.error(err);
    if (err.message === "ModelNotFound") return new Response(JSON.stringify({ error: "Model not found" }), { status: 404 });
    return new Response(JSON.stringify({ error: err.message }), { status: 400 });
  }
}
