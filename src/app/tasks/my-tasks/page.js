"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState, useCallback } from "react"

export default function DashboardPage() {
  const { data: session, status } = useSession({ required: true })

  const [tasks, setTasks] = useState(null)
  const [loadingTasks, setLoadingTasks] = useState(true)
  const [hasFetchedTasks, setHasFetchedTasks] = useState(false)

  const fetchTasks = useCallback(async () => {
    setLoadingTasks(true)
    try {
      const res = await fetch("/api/tasks/my-tasks", {
        method: "GET",
        credentials: "include",
      })

      const data = await res.json()

      if (Array.isArray(data)) {
        setTasks(data)
        setHasFetchedTasks(true)
      } else {
        console.error("Invalid data from API:", data)
        setTasks([])
      }
    } catch (error) {
      console.error("Ошибка при загрузке задач:", error)
      setTasks([])
    } finally {
      setLoadingTasks(false)
    }
  }, [])

  useEffect(() => {
    if (status === "authenticated" && !hasFetchedTasks) {
      fetchTasks()
    }
  }, [status, hasFetchedTasks, fetchTasks])

  if (status === "loading") return <p>Загрузка сессии...</p>
  if (!session) return <p>Вы не вошли в систему</p>
  if (loadingTasks) return <p>Загрузка задач...</p>
  if (!tasks?.length) return <p>Задачи не найдены</p>

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
