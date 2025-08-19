// app/admin/columns/page.js
"use client";
import { useEffect, useState } from "react";

export default function ColumnsPage() {
  const [columns, setColumns] = useState([]);
  const [title, setTitle] = useState("");
  const [color, setColor] = useState("#cccccc");

  async function load() {
    const res = await fetch("/api/columns");
    setColumns(await res.json());
  }

  async function createColumn() {
    await fetch("/api/columns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, color }),
    });
    setTitle("");
    await load();
  }

  async function deleteColumn(id) {
    await fetch(`/api/columns/${id}`, { method: "DELETE" });
    await load();
  }

  useEffect(() => { load(); }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Колонки</h2>

      <div className="flex gap-2 mb-4">
        <input
          className="border p-2 rounded"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Название"
        />
        <input
          type="color"
          className="border p-2 rounded"
          value={color}
          onChange={e => setColor(e.target.value)}
        />
        <button
          onClick={createColumn}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          ➕ Добавить
        </button>
      </div>

      <ul className="space-y-2">
        {columns.map(c => (
          <li key={c.id} className="flex items-center justify-between bg-white p-3 rounded shadow">
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 rounded" style={{ backgroundColor: c.color }} />
              {c.title}
            </span>
            <button
              onClick={() => deleteColumn(c.id)}
              className="text-red-600 hover:underline"
            >
              Удалить
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
