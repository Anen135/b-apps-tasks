// ─────────────────────────────────────────────────────────────────────────────
// File: src/lib/slug.js
// Desc: Slug utility with automatic de-duplication (appends -2, -3, ...)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Преобразует строку в slug.
 * @param {string} input - Входная строка.
 * @returns {string} - Очищенный slug.
 */
function toSlug(input) {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/**
 * Генерирует уникальный slug, проверяя его существование через переданную функцию.
 * @param {string} base - Базовая строка для slug.
 * @param {function} exists - Асинхронная функция, проверяющая, существует ли slug.
 * @returns {Promise<string>} - Уникальный slug.
 */
async function makeUniqueSlug(base, exists) {
  const root = toSlug(base) || "news";
  if (!(await exists(root))) return root;
  let i = 2;
  while (await exists(`${root}-${i}`)) i++;
  return `${root}-${i}`;
}

// Экспорт функций (для использования в Node.js или сборщиках)
module.exports = { toSlug, makeUniqueSlug };