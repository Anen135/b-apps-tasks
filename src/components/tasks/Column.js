// sourcery skip: use-braces
'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Plus, FolderOpen } from 'lucide-react'
import Task from './Task'
import clsx from 'clsx'

const COLUMN_MIN_WIDTH = 280
const COLUMN_TASKS_MAX_HEIGHT = 400

const Column = ({
  title,
  columnId,
  tasks,
  activeId,
  onTaskUpdate,
  onTaskDelete,
  onTaskCreate,
}) => {
  const { setNodeRef, isOver } = useDroppable({ id: columnId })
  const taskRefs = useRef({})
  const [taskHeights, setTaskHeights] = useState({})
  const [page, setPage] = useState(0)

  const handleAddTask = () => onTaskCreate?.(columnId)

  // Measure task heights after mount/update
  useEffect(() => {
    const newHeights = {}
    for (const id in taskRefs.current) {
      const el = taskRefs.current[id]
      if (el) newHeights[id] = el.offsetHeight
    }
    setTaskHeights(newHeights)
  }, [tasks])

  // Paginate tasks based on height constraint
  const paginatedTasks = useCallback(() => {
    const pages = []
    let currentPage = []
    let currentHeight = 0

    for (const task of tasks) {
      const height = taskHeights[task.id] ?? 100

      // If task is too large and nothing on current page, include it alone
      if (height > COLUMN_TASKS_MAX_HEIGHT && currentPage.length === 0) {
        pages.push([task])
        continue
      }

      // If adding this task exceeds limit, start new page
      if (currentHeight + height > COLUMN_TASKS_MAX_HEIGHT && currentPage.length > 0) {
        pages.push(currentPage)
        currentPage = [task]
        currentHeight = height
      } else {
        currentPage.push(task)
        currentHeight += height
      }
    }

    if (currentPage.length) pages.push(currentPage)
    return pages
  }, [tasks, taskHeights])()

  // Adjust page if overflowed by deletion or height change
  useEffect(() => {
    const pages = paginatedTasks
    if (page >= pages.length && page > 0) {
      setPage(pages.length - 1)
    }
  }, [paginatedTasks, page])

  const totalPages = paginatedTasks.length
  const currentTasks = paginatedTasks[page] || []

  return (
    <div
      ref={setNodeRef}
      className={clsx(
        'rounded-xl p-4 shadow-sm bg-muted transition-colors flex flex-col',
        isOver && 'border-2 border-dashed border-primary'
      )}
      style={{ minWidth: COLUMN_MIN_WIDTH }}
    >
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold truncate pr-2">{title}</h2>
        <Button size="icon" variant="ghost" onClick={handleAddTask}>
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      <SortableContext items={currentTasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
        <div
          className="flex flex-col gap-3 overflow-y-auto"
          style={{ maxHeight: COLUMN_TASKS_MAX_HEIGHT }}
        >
          {tasks.length === 0 ? (
            <div
              onClick={handleAddTask}
              className={clsx(
                'flex flex-col items-center justify-center gap-1 h-28 border-2 border-dashed rounded-xl text-muted-foreground cursor-pointer transition',
                isOver ? 'border-primary/40 bg-muted/50' : 'border-muted-foreground/40 hover:bg-muted'
              )}
            >
              <FolderOpen className="w-6 h-6" />
              <span className="text-sm">Пусто — нажмите, чтобы добавить</span>
            </div>
          ) : (
            currentTasks.map((task) => (
              <Task
                key={task.id}
                id={task.id}
                content={task.content}
                activeId={activeId}
                onUpdate={(newContent) => onTaskUpdate(columnId, task.id, newContent)}
                onDelete={() => onTaskDelete(columnId, task.id)}
                ref={(el) => (taskRefs.current[task.id] = el)}
              />
            ))
          )}
        </div>
      </SortableContext>

      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-3">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-xs text-muted-foreground">
            {page + 1} / {totalPages}
          </span>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  )
}

export default Column