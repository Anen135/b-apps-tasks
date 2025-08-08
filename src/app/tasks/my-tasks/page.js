"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"

export default function DashboardPage() {
  const { data: session, status } = useSession({ required: true, })

  const [tasks, setTasks] = useState(null)
  const [loadingTasks, setLoadingTasks] = useState(true)

const [hasFetchedTasks, setHasFetchedTasks] = useState(false)

useEffect(() => {
  if (status === "authenticated" && !hasFetchedTasks) {
    setLoadingTasks(true)
    fetch("/api/tasks/my-tasks", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setTasks(data)
          setHasFetchedTasks(true) // не загружать повторно
        } else {
          console.error("Invalid data from API:", data)
          setTasks([])
        }
      })
      .catch((err) => {
        console.error(err)
        setTasks([])
      })
      .finally(() => setLoadingTasks(false))
  }
}, [status, hasFetchedTasks])







  if (status === "loading") return <p>Загрузка...</p>
  if (!session) return <p>Вы не вошли в систему</p>
  if (loadingTasks && tasks === null) return <p>Загрузка задач...</p>


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
