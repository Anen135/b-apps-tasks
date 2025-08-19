// app/api/admin/[model]/route.js
import prisma from "@/lib/prisma";

function getModelClient(model) {
  const client = prisma[model];
  if (!client) throw new Error("ModelNotFound");
  return client;
}

function parseQueryParams(url) {
  // accepted params:
  // q=searchText
  // page, pageSize
  // sort=field:asc|desc  (can be comma separated)
  // filter[field]=value (simple equality) or filter[field][contains]=foo
  const params = Object.fromEntries(url.searchParams.entries());
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const pageSize = parseInt(url.searchParams.get("pageSize") || "20", 10);
  const sort = url.searchParams.get("sort") || null;
  const q = url.searchParams.get("q") || null;
  // build filters
  const filters = {};
  for (const [k, v] of url.searchParams.entries()) {
    if (k.startsWith("filter[")) {
      // filter[field]=value OR filter[field][op]=value
      // parse keys like filter[name] or filter[name][contains]
      const inside = k.slice(7, -1); // name] or name][contains -> we need better parse
      const bracketIdx = k.indexOf("][");
      if (bracketIdx === -1) {
        const field = k.slice(7, -1);
        filters[field] = v;
      } else {
        const field = k.slice(7, bracketIdx);
        const op = k.slice(bracketIdx + 2, -1);
        if (!filters[field]) filters[field] = {};
        filters[field][op] = v;
      }
    }
  }
  return { page, pageSize, sort, q, filters };
}

function buildWhereFromFilters(filters, q, sampleRow) {
  const where = {};

  // apply explicit filters
  for (const key in filters) {
    const val = filters[key];
    if (typeof val === "object") {
      // handle contains, gt, lt, gte, lte
      where[key] = {};
      for (const op in val) {
        if (op === "contains") where[key].contains = val[op];
        else if (op === "gt") where[key].gt = val[op];
        else if (op === "lt") where[key].lt = val[op];
        else if (op === "gte") where[key].gte = val[op];
        else if (op === "lte") where[key].lte = val[op];
        else where[key][op] = val[op];
      }
    } else {
      where[key] = filters[key];
    }
  }

  // full-text-ish search across string fields if q provided
  if (q && sampleRow) {
    const or = [];
    for (const key in sampleRow) {
      const val = sampleRow[key];
      if (typeof val === "string") {
        const cond = {};
        cond[key] = { contains: q, mode: "insensitive" };
        or.push(cond);
      }
    }
    if (or.length) where.OR = or;
  }

  return where;
}

export async function GET(req, { params }) {
  try {
    // TODO: put your admin check here using cookies/headers (you said auth is implemented separately)
    const model = params.model;
    const client = getModelClient(model);

    const url = new URL(req.url);
    const { page, pageSize, sort, q, filters } = parseQueryParams(url);

    // get a sample row to detect string fields for search
    const sample = await client.findFirst({ take: 1 });

    const where = buildWhereFromFilters(filters, q, sample || {});

    // build orderBy
    let orderBy = undefined;
    if (sort) {
      // sort=field:asc,other:desc
      orderBy = sort.split(",").map(s => {
        const [field, dir] = s.split(":");
        return { [field]: dir === "desc" ? "desc" : "asc" };
      });
    }

    const total = await client.count({ where });
    const items = await client.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return new Response(JSON.stringify({ items, total, page, pageSize }), { status: 200 });
  } catch (err) {
    console.error(err);
    if (err.message === "ModelNotFound") {
      return new Response(JSON.stringify({ error: "Model not found" }), { status: 404 });
    }
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

export async function POST(req, { params }) {
  try {
    const model = params.model;
    const client = getModelClient(model);
    const body = await req.json();

    // body must be an object with fields matching model
    const created = await client.create({ data: body });

    return new Response(JSON.stringify({ item: created }), { status: 201 });
  } catch (err) {
    console.error(err);
    if (err.message === "ModelNotFound") {
      return new Response(JSON.stringify({ error: "Model not found" }), { status: 404 });
    }
    return new Response(JSON.stringify({ error: err.message }), { status: 400 });
  }
}
