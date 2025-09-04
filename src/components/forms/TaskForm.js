"use client";
import { useEffect, useState, useCallback } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Droplet } from "lucide-react";
import { SketchPicker } from "react-color";
import { FaEdit, FaPlus, FaSave, FaTimes, FaThumbtack } from "react-icons/fa";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function TaskForm({ task, onSaved, onCanceled }) {
  const [form, setForm] = useState({
    content: "",
    color: "#cccccc",
    position: 0,
    columnId: "",
    assignees: [],
    tags: "",
  });
  const [columns, setColumns] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // загрузка справочников
  useEffect(() => {
    const loadRefs = async () => {
      try {
        const [resCols, resUsers] = await Promise.all([
          fetch("/api/columns"),
          fetch("/api/users"),
        ]);
        setColumns(await resCols.json());
        setUsers(await resUsers.json());
      } catch (e) {
        console.error("Ошибка загрузки справочников", e);
      }
    };
    loadRefs();
  }, []);

  useEffect(() => {
    if (task) {
      setForm({
        content: task.content,
        color: task.color,
        position: task.position,
        columnId: task.columnId,
        assignees: task.assignees?.map((u) => u.id) || [],
        tags: task.tags?.join(", ") || "",
      });
    } else {
      resetForm();
    }
  }, [task]);

  const updateForm = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setForm({ content: "", color: "#cccccc", position: 0, columnId: "", assignees: [], tags: "" });
  };

  const saveTask = useCallback(async () => {
    if (!form.content.trim() || !form.columnId) {
      alert("Заполните текст задачи и выберите колонку");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        ...form,
        position: Number(form.position) || 0,
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      };
      const url = task ? `/api/tasks/${task.id}` : "/api/tasks";
      const method = task ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Ошибка сохранения");

      const saved = await res.json();
      onSaved?.(saved); // уведомляем родителя
      resetForm();
    } catch (e) {
      console.error(e);
      alert("Ошибка при сохранении");
    } finally {
      setLoading(false);
    }
  }, [form, task, onSaved]);

  return (
    <div className="flex-1 w-full md:min-w-[480px] lg:min-w-[560px] bg-white p-4 rounded-2xl shadow space-y-3 border border-gray-200">
      <h3 className="font-semibold text-lg">
        {task ? (
          <span className="flex items-center gap-2">
            <FaEdit /> Редактирование: {task.content}
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <FaPlus /> Новая задача
          </span>
        )}
      </h3>

      <input
        className="border p-2 rounded-lg w-full"
        value={form.content}
        onChange={(e) => updateForm("content", e.target.value)}
        placeholder="Текст задачи"
      />

      <div className="flex gap-2 flex-wrap">
        <Popover>
          <PopoverTrigger asChild>
            <Button type="button" variant="outline" className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full border" style={{ backgroundColor: form.color }} />
              <Droplet size={14} />
              <span>Цвет</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-2 w-auto">
            <SketchPicker
              color={form.color}
              onChange={(newColor) => updateForm("color", newColor.hex)}
              disableAlpha
            />
          </PopoverContent>
        </Popover>

        <input
          type="number"
          className="border p-2 rounded-lg flex-1"
          value={form.position}
          onChange={(e) => updateForm("position", Number(e.target.value) || 0)}
          placeholder="Позиция"
        />
      </div>

      <Select value={form.columnId} onValueChange={(v) => updateForm("columnId", v)}>
        <SelectTrigger className="min-w-[200px] w-full">
          <SelectValue placeholder="Выберите колонку" />
        </SelectTrigger>
        <SelectContent>
          {columns.length > 0 ? (
            columns.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.title}
              </SelectItem>
            ))
          ) : (
            <SelectItem disabled>Нет колонок</SelectItem>
          )}
        </SelectContent>
      </Select>

      <select
        multiple
        className="border p-2 rounded-lg w-full h-32"
        value={form.assignees}
        onChange={(e) =>
          updateForm("assignees", Array.from(e.target.selectedOptions, (opt) => opt.value))
        }
      >
        {users.length > 0 ? (
          users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.login} ({u.nickname})
            </option>
          ))
        ) : (
          <option disabled>Нет пользователей</option>
        )}
      </select>

      <input
        className="border p-2 rounded-lg w-full"
        value={form.tags}
        onChange={(e) => updateForm("tags", e.target.value)}
        placeholder="Теги (через запятую)"
      />

      <div className="flex gap-2 flex-wrap">
        <button
          onClick={saveTask}
          className={`bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 flex-1 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {task ? <FaSave /> : loading ? <FaThumbtack className="animate-spin" /> : <FaPlus />}
          {task ? "Сохранить" : loading ? "Загрузка..." : "Создать"}
        </button>

        {task && (
          <button
            onClick={onCanceled}
            className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <FaTimes /> Отмена
          </button>
        )}
      </div>
    </div>
  );
}
