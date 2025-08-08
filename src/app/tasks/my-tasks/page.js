"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState, useCallback } from "react"
import { Loader2, ClipboardList, AlertTriangle } from "lucide-react"

export default function MyTasks() {
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

  if (status === "loading" || loadingTasks) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-600">
        <Loader2 className="w-8 h-8 animate-spin mb-2" />
        <p>Загрузка...</p>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-red-600">
        <AlertTriangle className="w-8 h-8 mb-2" />
        <p>Вы не вошли в систему</p>
      </div>
    )
  }

  if (!tasks?.length) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-500">
        <ClipboardList className="w-8 h-8 mb-2" />
        <p>Задачи не найдены</p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6 min-h-screen">
      <div className="flex items-center gap-3">
        <ClipboardList className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold">Мои задачи</h2>
      </div>

      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="border rounded-xl p-4 shadow-sm hover:shadow-md transition duration-200 bg-white"
          >
            <h3 className="text-lg font-semibold text-gray-800">{task.content}</h3>
            <p className="text-sm text-gray-500 mt-1">
              Колонка: <span className="font-medium">{task.column.title}</span>
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}
