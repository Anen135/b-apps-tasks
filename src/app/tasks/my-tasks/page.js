// src/app/tasks/my-tasks/page.js
// sourcery skip: use-braces
import { useSession } from "next-auth/react"
import useSWR from "swr"

const fetcher = (url) => fetch(url).then(res => res.json())

export default function MyTasks() {
  const { data: session } = useSession()
  const { data: tasks, error } = useSWR("/api/my-tasks", fetcher)

  if (!session) return <p>Пожалуйста, войдите</p>
  if (error) return <p>Ошибка при загрузке</p>
  if (!tasks) return <p>Загрузка задач...</p>

  return (
    <div>
      <h2>Мои задачи ({tasks.length})</h2>
      {tasks.map(task => (
        <div key={task.id}>
          <b>{task.content}</b> (в колонке: {task.column.title})
        </div>
      ))}
    </div>
  )
}
