// src/utils/pagination.js
export function normalizePagination({ page = 1, perPage = 20, maxPerPage = 200 } = {}) {
  page = Number(page) || 1;
  perPage = Math.min(Number(perPage) || 20, maxPerPage);
  const skip = (page - 1) * perPage;
  return { page, perPage, skip, take: perPage };
}

export function buildCursorPagination({ cursor, take = 20 }) {
  // simple cursor: id-based
  return { cursor: cursor ? { id: cursor } : undefined, take };
}

export function toPageResult(items, { page, perPage, total }) {
  const pageCount = Math.ceil(total / perPage);
  return { meta: { total, page, perPage, pageCount }, data: items };
}
