// ─────────────────────────────────────────────────────────────────────────────
// File: src/lib/http.js
// Desc: Small helpers for responses & parsing
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from "next/server";

/**
 * Возвращает успешный JSON-ответ с данными (статус 200).
 * @param {*} data - Данные для отправки.
 * @param {ResponseInit} init - Дополнительные параметры ответа.
 * @returns {NextResponse}
 */
function jsonOk(data, init = {}) {
  return NextResponse.json({ ok: true, data }, { status: 200, ...init });
}

/**
 * Возвращает JSON-ответ при создании ресурса (статус 201).
 * @param {*} data - Данные нового ресурса.
 * @param {ResponseInit} init - Дополнительные параметры ответа.
 * @returns {NextResponse}
 */
function jsonCreated(data, init = {}) {
  return NextResponse.json({ ok: true, data }, { status: 201, ...init });
}

/**
 * Возвращает JSON-ответ с ошибкой.
 * @param {string} message - Сообщение об ошибке.
 * @param {number} status - HTTP статус (по умолчанию 400).
 * @param {Object} extra - Дополнительные поля в теле ответа.
 * @returns {NextResponse}
 */
function jsonError(message, status = 400, extra = {}) {
  return NextResponse.json({ ok: false, message, ...extra }, { status });
}

/**
 * Парсит строковый query-параметр в целое положительное число.
 * @param {string|string[]|undefined} value - Значение из query string.
 * @param {number} def - Значение по умолчанию.
 * @returns {number}
 */
function parseIntQs(value, def) {
  if (typeof value !== "string") return def;
  const n = parseInt(value, 10);
  return Number.isFinite(n) && n > 0 ? n : def;
}

// Экспорт функций (CommonJS)
module.exports = { jsonOk, jsonCreated, jsonError, parseIntQs };