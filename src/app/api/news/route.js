// Версия без TypeScript и Zod

import prisma from "@/lib/prisma";
import { jsonOk, jsonCreated, jsonError } from "@/lib/http";
import { makeUniqueSlug } from "@/lib/slug";

// GET (список)
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = Math.min(parseInt(searchParams.get("limit")) || 20, 100);
    const search = searchParams.get("search") || null;
    const tag = searchParams.get("tag") || null;
    const trending = searchParams.get("trending");
    const category = searchParams.get("category") || null;
    const sort = searchParams.get("sort") || "createdAt";
    const order = searchParams.get("order") || "desc";

    const where = {};
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { excerpt: { contains: search, mode: "insensitive" } },
        { tags: { has: search } },
      ];
    }
    if (tag) where.tags = { has: tag };
    if (typeof trending !== "undefined" && (trending === "true" || trending === "false")) {
      where.trending = trending === "true";
    }
    if (category) where.category = category;

    const total = await prisma.news.count({ where });
    const items = await prisma.news.findMany({
      where,
      take: limit,
      skip: (page - 1) * limit,
      orderBy: { [sort]: order },
      include: { author: true },
    });

    return jsonOk({ items, page, limit, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    console.error(err);
    return jsonError("Failed to fetch news", 500);
  }
}

// POST (создание)
export async function POST(req) {
  try {
    const body = await req.json();
    if (!body || !body.title || !body.excerpt) {
      return jsonError("Missing required fields: title, excerpt", 400);
    }

    const slug = await makeUniqueSlug(body.slug || body.title, async (s) => {
      const found = await prisma.news.findUnique({ where: { slug: s } });
      return Boolean(found);
    });

    const created = await prisma.news.create({
      data: {
        title: body.title,
        slug,
        excerpt: body.excerpt,
        cover: body.cover,
        readTime: body.readTime,
        trending: body.trending,
        tags: body.tags,
        category: body.category,
        authorId: body.authorId,
      },
      include: { author: true },
    });

    return jsonCreated(created);
  } catch (err) {
    console.error(err);
    return jsonError("Failed to create news", 500);
  }
}

