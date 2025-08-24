// app/admin/tasks/page.js
"use client";
import { useEffect, useState } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Droplet } from "lucide-react"
import { SketchPicker } from "react-color"
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
  const [userId, setUserId] = useState("");
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
      userId: userId || null,
      tags: tags.split(",").map(t => t.trim()).filter(Boolean),
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
    setUserId("");
    setTags("");
  };

  const selectTask = (task) => {
    setSelectedTask(task);
    setContent(task.content);
    setColor(task.color);
    setPosition(task.position);
    setColumnId(task.columnId);
    setUserId(task.userId || "");
    setTags(task.tags?.join(", ") || "");
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <main className="min-h-screen transition-all duration-200 ease-out px-3 overflow-x-hidden">
      <h2 className="text-3xl font-bold mb-4 lg:pl-10 flex items-center gap-2 lg:sticky lg:top-2">
        Управление задачами
      </h2>

      {/* Две колонки: форма + список. Перенос вниз, когда не хватает места */}
      <div className="flex flex-wrap items-start gap-4">
      {/* Форма */}
      <div className="lg:sticky lg:top-14 flex-1 w-full md:min-w-[480px] lg:min-w-[560px] max-h-fit bg-white p-4 md:p-6 rounded-2xl shadow space-y-3 md:space-y-4 border border-gray-200 text-sm md:text-base">
        <h3 className="font-semibold text-base md:text-lg flex flex-col gap-1">
          {selectedTask ? (

              <>
                <div className="flex items-center gap-2">
                  <FaEdit size={16} className="md:size-4" /> Редактирование
                </div>
                <span className="text-purple-600 break-words">{selectedTask.content}</span>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <FaPlus size={16} className="md:size-4" /> Новая задача
              </div>
            )}
          </h3>

          <input
            className="border p-2 rounded-lg w-full text-sm md:text-base"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Текст задачи"
          />

          <div className="flex gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="flex items-center gap-2 text-sm md:text-base"
                  >
                    <div
                      className="h-3 w-3 md:h-4 md:w-4 rounded-full border"
                      style={{ backgroundColor: color }}
                    />
                    <Droplet size={14} className="md:size-4" />
                    <span>Выбрать цвет</span>
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
            </div>

            <input
              type="number"
              className="border p-2 rounded-lg flex-1 text-sm md:text-base"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              placeholder="Позиция"
            />
          </div>

          <select
            className="border p-2 rounded-lg w-full text-sm md:text-base"
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

          <select
            className="border p-2 rounded-lg w-full text-sm md:text-base"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          >
            <option value="">Не назначено</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.login} ({u.nickname})
              </option>
            ))}
          </select>

          <input
            className="border p-2 rounded-lg w-full text-sm md:text-base"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Теги (через запятую)"
          />

          <div className="flex gap-2 flex-wrap">
            <button
              onClick={saveTask}
              className="bg-[var(--button-color)] hover:bg-[var(--button-hover-color)] text-white px-3 md:px-4 py-1.5 md:py-2 rounded-lg flex-1 flex items-center justify-center gap-2 transition text-sm md:text-base"
            >
              {selectedTask ? (
                <>
                  <FaSave size={14} className="md:size-4" /> Сохранить
                </>
              ) : (
                <>
                  <FaPlus size={14} className="md:size-4" /> Добавить
                </>
              )}
            </button>

            {selectedTask && (
              <button
                onClick={clearForm}
                className="bg-gray-300 hover:bg-gray-400 px-3 md:px-4 py-1.5 md:py-2 rounded-lg flex items-center gap-2 transition text-sm md:text-base"
              >
                <FaTimes size={14} className="md:size-4" /> Отмена
              </button>
            )}
          </div>
        </div>

        {/* Список задач */}
        <div className="flex-[2] basis-[420px] min-w-[280px] max-w-full min-w-0 space-y-2 md:space-y-3 pb-3 text-sm md:text-base">
          {tasks.map((t) => (
            <div
              key={t.id}
              className={`p-2 md:p-3 rounded-lg shadow flex flex-col gap-2 border-l-8 transition cursor-pointer overflow-hidden ${selectedTask?.id === t.id ? "bg-purple-50 ring-2 ring-purple-400" : "bg-white"
                }`}
              style={{ borderColor: t.color }}
              onClick={() => selectTask(t)}
            >
              {/* Верхняя часть карточки */}
              <div className="flex flex-col md:flex-row md:items-start md:gap-3 md:flex-nowrap">
                {/* Левая группа: аватар + мобильная кнопка удалить */}
                <div className="flex items-start justify-between gap-2 md:gap-3">
                  {t.user?.avatarUrl ? (
                    <Avatar className="h-8 w-8 md:h-10 md:w-10 shrink-0">
                      <AvatarImage src={t.user.avatarUrl} />
                      <AvatarFallback>AU</AvatarFallback>
                    </Avatar>
                  ) : (
                    <Avatar className="h-8 w-8 md:h-10 md:w-10 shrink-0">
                      <AvatarFallback>?</AvatarFallback>
                    </Avatar>
                  )}

                  {/* Удалить (мобилы) */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteTask(t.id);
                    }}
                    className="self-start text-red-600 hover:text-red-800 flex items-center gap-1 px-1.5 py-1 text-xs md:hidden transition"
                  >
                    <FaTrash size={12} /> Удалить
                  </button>
                </div>


                {/* Контент задачи */}
                <div className="flex-1 min-w-0">
                  <div className="font-medium break-words mb-2">{t.content}</div>

                  <div className="text-xs md:text-sm text-gray-500 flex flex-col md:flex-row md:flex-wrap md:items-center gap-1 md:gap-x-2">
                    {/* Позиция */}
                    <div className="flex items-center gap-1">
                      <FaThumbtack size={12} className="text-gray-400" />
                      <span>Позиция: {t.position}</span>
                    </div>

                    {/* Разделитель — только на desktop */}
                    <span className="hidden md:inline text-gray-400">|</span>

                    {/* Колонка */}
                    <div className="flex items-center gap-1">
                      <FaColumns size={12} className="text-gray-400" />
                      <span>Колонка: {t.column?.title}</span>
                    </div>

                    <span className="hidden md:inline text-gray-400">|</span>

                    {/* Пользователь */}
                    <div className="flex items-center gap-1">
                      <FaUser size={12} className="text-gray-400" />
                      <span>
                        Пользователь: {t.user?.nickname || t.user?.userId || "Not found"}
                      </span>
                    </div>
                  </div>

                  {t.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {t.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-gray-200 text-gray-700 px-1.5 md:px-2 py-0.5 rounded-full text-[10px] md:text-xs"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Удалить (md+) */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteTask(t.id);
                  }}
                  className="hidden md:inline-flex shrink-0 text-red-600 hover:text-red-800 items-center gap-1 px-2 py-1 text-sm transition ml-auto"
                >
                  <FaTrash /> Удалить
                </button>
              </div>
            </div>
          ))}

          {tasks.length === 0 && <div className="text-gray-500 italic">Нет задач</div>}
        </div>
      </div>
    </main>
  );

}
