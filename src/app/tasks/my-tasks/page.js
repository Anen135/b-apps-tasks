"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const [tasks, setTasks] = useState(null)

  useEffect(() => {
    if (session) {
      fetch("/api/my-tasks")
        .then((res) => res.json())
        .then((data) => setTasks(data))
    }
  }, [session])

  if (status === "loading") return <p>Загрузка...</p>
  if (!session) return <p>Вы не вошли в систему</p>
  if (!tasks) return <p>Загрузка задач...</p>

  return (
    <div>
      <h2>Мои задачи</h2>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <strong>{task.content}</strong> — колонка: {task.column.title}
          </li>
        ))}
      </ul>
    </div>
  )
}
