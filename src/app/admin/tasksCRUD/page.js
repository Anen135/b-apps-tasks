"use client";
import { useState } from "react";
import TaskForm from "@/components/forms/TaskForm";
import TaskList from "@/components/lists/TaskList";

export default function TasksPage() {
  const [selectedTask, setSelectedTask] = useState(null);

  return (
    <main className="min-h-screen px-3 my-15">
      <h2 className="text-3xl font-bold mb-4">Управление задачами</h2>
      <div className="flex flex-wrap items-start gap-4">
        <TaskForm
          task={selectedTask}
          onSaved={() => setSelectedTask(null)}
          onCanceled={() => setSelectedTask(null)}
        />

        <TaskList
          selectedTask={selectedTask}
          onSelect={setSelectedTask}
          onChanged={() => setSelectedTask(null)}
        />
      </div>
    </main>
  );
}
