'use client'

import { useSession } from "next-auth/react"
import useSWR from "swr"

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error("Ошибка при загрузке задач")
  return res.json()
}

export default function MyTasks() {
  const { data: session, status } = useSession()
  const {
    data: tasks,
    error,
    isLoading,
  } = useSWR(session ? "/api/my-tasks" : null, fetcher)

  if (status === "loading") return <p>Загрузка сессии...</p>
  if (status === "unauthenticated") return <p>Пожалуйста, войдите</p>

  if (isLoading) return <p>Загрузка задач...</p>
  if (error) return <p>Произошла ошибка: {error.message}</p>

  if (!tasks || tasks.length === 0) {
    return <p>У вас пока нет задач</p>
  }

  return (
    <div>
      <h2>Мои задачи ({tasks.length})</h2>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <strong>{task.content}</strong> (в колонке: {task.column.title})
          </li>
        ))}
      </ul>
    </div>
  )
}
