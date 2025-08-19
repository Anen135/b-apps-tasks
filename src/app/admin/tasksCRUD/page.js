// app/admin/tasks/page.js
"use client";
import { useEffect, useState } from "react";

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [columns, setColumns] = useState([]);
  const [users, setUsers] = useState([]);

  // выбранная задача для редактирования
  const [selectedTask, setSelectedTask] = useState(null);

  // поля формы
  const [content, setContent] = useState("");
  const [color, setColor] = useState("#cccccc");
  const [position, setPosition] = useState(0);
  const [columnId, setColumnId] = useState("");
  const [userId, setUserId] = useState("");
  const [tags, setTags] = useState("");

  async function load() {
    const resTasks = await fetch("/api/tasks");
    setTasks(await resTasks.json());

    const resCols = await fetch("/api/columns");
    setColumns(await resCols.json());

    const resUsers = await fetch("/api/users");
    setUsers(await resUsers.json());
  }

  async function saveTask() {
    if (selectedTask) {
      // обновление
      await fetch(`/api/tasks/${selectedTask.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          color,
          position: Number(position),
          columnId,
          userId: userId || null,
          tags: tags.split(",").map(t => t.trim()).filter(Boolean),
        }),
      });
    } else {
      // создание
      await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          color,
          position: Number(position),
          columnId,
          userId: userId || null,
          tags: tags.split(",").map(t => t.trim()).filter(Boolean),
        }),
      });
    }

    clearForm();
    await load();
  }

  async function deleteTask(id) {
    await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    if (selectedTask?.id === id) clearForm();
    await load();
  }

  function clearForm() {
    setSelectedTask(null);
    setContent("");
    setColor("#cccccc");
    setPosition(0);
    setColumnId("");
    setUserId("");
    setTags("");
  }

  function selectTask(task) {
    setSelectedTask(task);
    setContent(task.content);
    setColor(task.color);
    setPosition(task.position);
    setColumnId(task.columnId);
    setUserId(task.userId || "");
    setTags(task.tags?.join(", ") || "");
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Задачи</h2>

      {/* Форма создания/редактирования задачи */}
      <div className="bg-white p-4 rounded shadow mb-6 space-y-3">
        <h3 className="font-semibold">
          {selectedTask ? `Редактирование задачи: ${selectedTask.content}` : "Новая задача"}
        </h3>

        <input
          className="border p-2 rounded w-full"
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Текст задачи"
        />

        <div className="flex gap-2">
          <input
            type="color"
            className="border p-2 rounded w-20"
            value={color}
            onChange={e => setColor(e.target.value)}
          />
          <input
            type="number"
            className="border p-2 rounded flex-1"
            value={position}
            onChange={e => setPosition(e.target.value)}
            placeholder="Позиция"
          />
        </div>

        <select
          className="border p-2 rounded w-full"
          value={columnId}
          onChange={e => setColumnId(e.target.value)}
        >
          <option value="">Выберите колонку</option>
          {columns.map(c => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>

        <select
          className="border p-2 rounded w-full"
          value={userId}
          onChange={e => setUserId(e.target.value)}
        >
          <option value="">Не назначено</option>
          {users.map(u => (
            <option key={u.id} value={u.id}>
              {u.login} ({u.nickname})
            </option>
          ))}
        </select>

        <input
          className="border p-2 rounded w-full"
          value={tags}
          onChange={e => setTags(e.target.value)}
          placeholder="Теги (через запятую)"
        />

        <div className="flex gap-2">
          <button
            onClick={saveTask}
            className="bg-blue-500 text-white px-4 py-2 rounded flex-1"
          >
            {selectedTask ? "💾 Сохранить изменения" : "➕ Добавить задачу"}
          </button>
          {selectedTask && (
            <button
              onClick={clearForm}
              className="bg-gray-300 px-4 py-2 rounded"
            >
              Отмена
            </button>
          )}
        </div>
      </div>

      {/* Список задач */}
      <ul className="space-y-2">
        {tasks.map(t => (
          <li key={t.id} className="bg-white p-3 rounded shadow">
            <div className="flex justify-between">
              <div
                className="flex gap-2 items-center cursor-pointer"
                onClick={() => selectTask(t)}
              >
                <span
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: t.color }}
                />
                <span>{t.content}</span>
              </div>
              <button
                onClick={() => deleteTask(t.id)}
                className="text-red-600 hover:underline"
              >
                Удалить
              </button>
            </div>
            <div className="text-sm text-gray-500 mt-1">
              📌 Позиция: {t.position} | Колонка: {t.columnId} | Пользователь: {t.userId ?? "—"}
            </div>
            {t.tags?.length > 0 && (
              <div className="text-xs text-gray-600">🏷️ {t.tags.join(", ")}</div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
j