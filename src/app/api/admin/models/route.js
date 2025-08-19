// app/api/admin/models/route.js
import prisma from "@/lib/prisma";

export async function GET(req) {
  try {
    // Попытка получить список моделей из DMMF (internal but useful)
    const dmmf = prisma._dmmf;
    const models = dmmf?.modelMap ? Object.keys(dmmf.modelMap) : dmmf?.datamodel?.models?.map(m => m.name) || [];
    return new Response(JSON.stringify({ models }), { status: 200 });
  } catch (err) {
    console.error("models list err", err);
    return new Response(JSON.stringify({ models: [] }), { status: 200 });
  }
}
