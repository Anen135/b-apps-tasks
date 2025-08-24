"use client";
import { useEffect, useState } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Droplet } from "lucide-react";
import { SketchPicker } from "react-color";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { FaEdit, FaPlus, FaSave, FaTimes, FaTrash, FaThumbtack, FaColumns, FaUser } from "react-icons/fa";

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [columns, setColumns] = useState([]);
  const [users, setUsers] = useState([]);

  const [selectedTask, setSelectedTask] = useState(null);

  const [content, setContent] = useState("");
  const [color, setColor] = useState("#cccccc");
  const [position, setPosition] = useState(0);
  const [columnId, setColumnId] = useState("");
  const [assignees, setAssignees] = useState([]);
  const [tags, setTags] = useState("");

  const load = async () => {
    const resTasks = await fetch("/api/tasks");
    setTasks(await resTasks.json());

    const resCols = await fetch("/api/columns");
    setColumns(await resCols.json());

    const resUsers = await fetch("/api/users");
    setUsers(await resUsers.json());
  };

  const saveTask = async () => {
    const payload = {
      content,
      color,
      position: Number(position),
      columnId,
      assignees,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
    };

    if (selectedTask) {
      await fetch(`/api/tasks/${selectedTask.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    clearForm();
    await load();
  };

  const deleteTask = async (id) => {
    await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    if (selectedTask?.id === id) clearForm();
    await load();
  };

  const clearForm = () => {
    setSelectedTask(null);
    setContent("");
    setColor("#cccccc");
    setPosition(0);
    setColumnId("");
    setAssignees([]);
    setTags("");
  };

  const selectTask = (task) => {
    setSelectedTask(task);
    setContent(task.content);
    setColor(task.color);
    setPosition(task.position);
    setColumnId(task.columnId);
    setAssignees(task.assignees?.map((u) => u.id) || []);
    setTags(task.tags?.join(", ") || "");
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <main className="min-h-screen px-3">
      <h2 className="text-3xl font-bold mb-4">Управление задачами</h2>

      <div className="flex flex-wrap items-start gap-4">
        {/* Форма */}
        <div className="flex-1 w-full md:min-w-[480px] lg:min-w-[560px] bg-white p-4 rounded-2xl shadow space-y-3 border border-gray-200">
          <h3 className="font-semibold text-lg">
            {selectedTask ? (
              <span className="flex items-center gap-2">
                <FaEdit /> Редактирование: {selectedTask.content}
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <FaPlus /> Новая задача
              </span>
            )}
          </h3>

          <input
            className="border p-2 rounded-lg w-full"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Текст задачи"
          />

          <div className="flex gap-2 flex-wrap">
            <Popover>
              <PopoverTrigger asChild>
                <Button type="button" variant="outline" className="flex items-center gap-2">
                  <div
                    className="h-4 w-4 rounded-full border"
                    style={{ backgroundColor: color }}
                  />
                  <Droplet size={14} />
                  <span>Цвет</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-2 w-auto">
                <SketchPicker
                  color={color}
                  onChange={(newColor) => setColor(newColor.hex)}
                  disableAlpha
                />
              </PopoverContent>
            </Popover>

            <input
              type="number"
              className="border p-2 rounded-lg flex-1"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              placeholder="Позиция"
            />
          </div>

          <select
            className="border p-2 rounded-lg w-full"
            value={columnId}
            onChange={(e) => setColumnId(e.target.value)}
          >
            <option value="">Выберите колонку</option>
            {columns.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>

          {/* Мультиселект для assignees */}
          <select
            multiple
            className="border p-2 rounded-lg w-full h-32"
            value={assignees}
            onChange={(e) =>
              setAssignees(Array.from(e.target.selectedOptions, (opt) => opt.value))
            }
          >
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.login} ({u.nickname})
              </option>
            ))}
          </select>

          <input
            className="border p-2 rounded-lg w-full"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Теги (через запятую)"
          />

          <div className="flex gap-2 flex-wrap">
            <button
              onClick={saveTask}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 flex-1"
            >
              {selectedTask ? <FaSave /> : <FaPlus />}
              {selectedTask ? "Сохранить" : "Добавить"}
            </button>

            {selectedTask && (
              <button
                onClick={clearForm}
                className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <FaTimes /> Отмена
              </button>
            )}
          </div>
        </div>

        {/* Список задач */}
        <div className="flex-[2] min-w-[280px] space-y-3">
          {tasks.map((t) => (
            <div
              key={t.id}
              className={`p-3 rounded-lg shadow flex flex-col gap-2 border-l-8 ${
                selectedTask?.id === t.id ? "bg-purple-50 ring-2 ring-purple-400" : "bg-white"
              }`}
              style={{ borderColor: t.color }}
              onClick={() => selectTask(t)}
            >
              <div className="flex justify-between items-start gap-3">
                {/* Аватары */}
                <div className="flex -space-x-2">
                  {t.assignees?.map((u) => (
                    <Avatar key={u.id} className="h-8 w-8">
                      <AvatarImage src={u.avatarUrl} />
                      <AvatarFallback>{u.nickname[0]}</AvatarFallback>
                    </Avatar>
                  ))}
                </div>

                {/* Удалить */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteTask(t.id);
                  }}
                  className="text-red-600 hover:text-red-800 flex items-center gap-1"
                >
                  <FaTrash /> Удалить
                </button>
              </div>

              <div className="font-medium">{t.content}</div>
              <div className="text-xs text-gray-500">
                Позиция: {t.position} | Колонка: {t.column?.title}
              </div>

              {t.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {t.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}

          {tasks.length === 0 && <div className="text-gray-500 italic">Нет задач</div>}
        </div>
      </div>
    </main>
  );
}
