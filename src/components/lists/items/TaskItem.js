"use client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { FaTrash } from "react-icons/fa";

export default function TaskItem({ task, selected, onSelect, onDelete }) {
  return (
    <div
      className={`p-3 rounded-lg shadow flex flex-col gap-2 border-l-8 cursor-pointer ${
        selected ? "bg-purple-50 ring-2 ring-purple-400" : "bg-white"
      }`}
      style={{ borderColor: task.color }}
      onClick={() => onSelect?.(task)}
    >
      <div className="flex justify-between items-start gap-3">
        <div className="flex -space-x-2">
          {task.assignees?.map((u) => (
            <Avatar key={u.id} className="h-8 w-8">
              <AvatarImage src={u.avatarUrl} />
              <AvatarFallback>{u.nickname[0]}</AvatarFallback>
            </Avatar>
          ))}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.(task.id);
          }}
          className="text-red-600 hover:text-red-800 flex items-center gap-1"
        >
          <FaTrash /> Удалить
        </button>
      </div>

      <div className="font-medium">{task.content}</div>
      <div className="text-xs text-gray-500">
        Позиция: {task.position} | Колонка: {task.column?.title}
      </div>

      {task.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1">
          {task.tags.map((tag) => (
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
  );
}
