"use client";
import { useEffect, useState, useCallback } from "react";
import TaskItem from "@/components/lists/items/TaskItem";

export default function TaskList({ selectedTask, onSelect, onChanged }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/tasks");
      if (!res.ok) throw new Error("Ошибка загрузки задач");
      setTasks(await res.json());
    } catch (e) {
      console.error(e);
      alert("Не удалось загрузить задачи");
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteTask = async (id) => {
    try {
      await fetch(`/api/tasks/${id}`, { method: "DELETE" });
      setTasks((prev) => prev.filter((t) => t.id !== id));
      onChanged?.();
    } catch (e) {
      console.error(e);
      alert("Ошибка удаления");
    }
  };

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  return (
    <div className="flex-[2] min-w-[280px] max-w-[750px] space-y-3">
      {loading ? (
        <div className="text-gray-500 italic">Загрузка...</div>
      ) : tasks.length > 0 ? (
        tasks.map((t) => (
          <TaskItem
            key={t.id}
            task={t}
            selected={selectedTask?.id === t.id}
            onSelect={onSelect}
            onDelete={deleteTask}
          />
        ))
      ) : (
        <div className="text-gray-500 italic">Нет задач</div>
      )}
    </div>
  );
}
