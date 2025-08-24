import prisma from "@/lib/prisma";
import { jsonOk, jsonError } from "@/lib/http";

async function findByIdOrSlug(idOrSlug) {
  return await prisma.news.findFirst({
    where: /^[a-z0-9]{25,}$/i.test(idOrSlug) ? { id: idOrSlug } : { slug: idOrSlug },
    include: { author: true },
  });
}

// GET (по ID или slug)
export async function GET_ITEM(_req, { params }) {
  try {
    const item = await findByIdOrSlug(params.idOrSlug);
    if (!item) return jsonError("Not found", 404);
    return jsonOk(item);
  } catch (err) {
    console.error(err);
    return jsonError("Failed to get item", 500);
  }
}

// PATCH (обновление)
export async function PATCH(req, { params }) {
  try {
    const existing = await findByIdOrSlug(params.idOrSlug);
    if (!existing) return jsonError("Not found", 404);

    const body = await req.json();
    if (!body || Object.keys(body).length === 0) {
      return jsonError("No fields to update", 400);
    }

    if (body.slug && body.slug !== existing.slug) {
      const dup = await prisma.news.findUnique({ where: { slug: body.slug } });
      if (dup) return jsonError("Slug already in use", 409);
    }

    const updated = await prisma.news.update({
      where: { id: existing.id },
      data: {
        title: body.title || existing.title,
        slug: body.slug || existing.slug,
        excerpt: body.excerpt || existing.excerpt,
        cover: body.cover !== undefined ? body.cover : existing.cover,
        readTime: body.readTime !== undefined ? body.readTime : existing.readTime,
        trending: body.trending !== undefined ? body.trending : existing.trending,
        tags: Array.isArray(body.tags) ? body.tags : existing.tags,
        category: body.category || existing.category,
        authorId: body.authorId !== undefined ? body.authorId : existing.authorId,
      },
      include: { author: true },
    });

    return jsonOk(updated);
  } catch (err) {
    console.error(err);
    return jsonError("Failed to update item", 500);
  }
}

// DELETE (удаление)
export async function DELETE(_req, { params }) {
  try {
    const existing = await findByIdOrSlug(params.idOrSlug);
    if (!existing) return jsonError("Not found", 404);

    await prisma.news.delete({ where: { id: existing.id } });
    return jsonOk({ id: existing.id, deleted: true });
  } catch (err) {
    console.error(err);
    return jsonError("Failed to delete item", 500);
  }
}
