"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState, useCallback } from "react"
import { motion } from "framer-motion"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { SketchPicker } from "react-color"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  Loader2,
  ClipboardList,
  AlertTriangle,
  Edit2,
  Save,
  X,
  Tags,
  PaintBucket,
  ListOrdered,
  Droplet
} from "lucide-react"

export default function MyTasks() {
  const { data: session, status } = useSession({ required: true })

  const [tasks, setTasks] = useState(null)
  const [loadingTasks, setLoadingTasks] = useState(true)
  const [hasFetchedTasks, setHasFetchedTasks] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [formData, setFormData] = useState({})
  const [columns, setColumns] = useState([])

  const fetchColumns = useCallback(async () => {
    try {
      const res = await fetch("/api/columns", { method: "GET" })
      if (!res.ok) throw new Error("Ошибка загрузки колонок")
      const data = await res.json()
      setColumns(data)
    } catch (err) {
      console.error(err)
      setColumns([])
    }
  }, [])

  useEffect(() => {
    fetchColumns()
  }, [fetchColumns])


  const fetchTasks = useCallback(async () => {
    setLoadingTasks(true)
    try {
      const res = await fetch("/api/users/me/tasks", {
        method: "GET",
        credentials: "include",
      })
      if (!res.ok) {
        const text = await res.text()
        console.error("Ошибка ответа сервера:", res.status, text)
        setTasks([])
        return
      }
      const data = await res.json()
      if (!Array.isArray(data)) {
        console.error("Некорректные данные от API:", data)
        setTasks([])
      }
      setTasks(data)
      setHasFetchedTasks(true)
    } catch (error) {
      console.error("Ошибка при загрузке задач:", error)
      setTasks([])
    } finally {
      setLoadingTasks(false)
    }
  }, [])

  useEffect(() => {
    if (status === "authenticated" && !hasFetchedTasks) fetchTasks()
  }, [status, hasFetchedTasks, fetchTasks])

  const startEditing = (task) => {
    setEditingTask(task.id)
    setFormData({ ...task, tags: task.tags.join(", ") })
  }

  const cancelEditing = () => {
    setEditingTask(null)
    setFormData({})
  }

  const saveTask = async () => {
    try {
      const res = await fetch("/api/users/me/tasks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(",").map((t) => t.trim()),
        }),
      })
      if (!res.ok) {
        const text = await res.text()
        console.error("Ошибка обновления задачи:", res.status, text)
        return
      }
      const updated = await res.json()
      setTasks(tasks.map((t) => (t.id === updated.id ? updated : t)))
      cancelEditing()
    } catch (error) {
      console.error("Ошибка при сохранении задачи:", error)
    }
  }

  if (status === "loading" || loadingTasks) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-muted-foreground">
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
      <div className="flex flex-col items-center justify-center h-screen text-muted-foreground">
        <ClipboardList className="w-8 h-8 mb-2" />
        <p>Задачи не найдены</p>
      </div>
    )
  }

  return (
    <main className="mx-auto max-w-5xl p-4 md:p-8 space-y-8 min-h-screen">
      <header className="flex items-center gap-3 border-b pb-4">
        <ClipboardList className="h-6 w-6 text-blue-600" />
        <h2 className="text-2xl font-bold">Мои задачи</h2>
      </header>

      <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tasks.map((task) => (
          <motion.li
            key={task.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="overflow-hidden border-0 shadow-sm hover:shadow-md transition dark:bg-zinc-900" style={{ borderLeft: `6px solid ${task.color || "transparent"}` }}>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">{task.content}</CardTitle>
                {editingTask === task.id ? (
                  <>
                    {/* Поле "Колонка" */}
                    <div className="space-y-1">
                      <label className="text-sm text-muted-foreground">Колонка</label>
                      <Select
                        value={formData.columnId?.toString() || ""}
                        onValueChange={(val) => setFormData({ ...formData, columnId: val })}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Выберите колонку" />
                        </SelectTrigger>
                        <SelectContent>
                          {columns.map((col) => (
                            <SelectItem key={col.id} value={col.id.toString()}>
                              {col.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                ) : <CardDescription> Колонка: <span className="font-medium" style={{ textDecoration: `underline ${task.column.color ?? "transparent"}`, textDecorationThickness: "2px", textUnderlineOffset: "2px" }}>{task.column.title}</span> </CardDescription>}
              </CardHeader>

              <CardContent className="space-y-2">
                {editingTask === task.id ? (
                  <div className="space-y-3">

                    {/* Поле "Позиция" */}
                    <input
                      className="w-full border rounded px-2 py-1"
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: Number(e.target.value) })}
                      type="number"
                      placeholder="Позиция"
                    />

                    {/* Color Picker через Popover */}
                    <div className="flex items-center gap-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            className="flex items-center gap-2"
                          >
                            <div
                              className="h-4 w-4 rounded-full border"
                              style={{ backgroundColor: formData.color }}
                            />
                            <Droplet size={16} />
                            <span>Выбрать цвет</span>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="p-2 w-auto">
                          <SketchPicker
                            color={formData.color}
                            onChange={(color) => setFormData({ ...formData, color: color.hex })}
                            disableAlpha
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    {/* Поле "Теги" */}
                    <input
                      className="w-full border rounded px-2 py-1"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      placeholder="Теги (через запятую)"
                    />

                    {/* Кнопки */}
                    <div className="flex gap-2">
                      <Button onClick={saveTask} className="bg-green-600 hover:bg-green-700">
                        <Save size={16} className="mr-1" /> Сохранить
                      </Button>
                      <Button
                        onClick={cancelEditing}
                        variant="secondary"
                        className="bg-gray-400 hover:bg-gray-500 text-white"
                      >
                        <X size={16} className="mr-1" /> Отмена
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <ListOrdered className="h-4 w-4" /> Позиция: {task.position}
                    </p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <PaintBucket className="h-4 w-4" /> Цвет: {task.color}
                    </p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Tags className="h-4 w-4" /> Теги: {task.tags?.join(", ") || "нет"}
                    </p>

                    <Separator className="my-2" />
                    <Button size="sm" onClick={() => startEditing(task)}>
                      <Edit2 className="mr-1 h-4 w-4" /> Редактировать
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.li>
        ))}
      </ul>
    </main>
  )
}
