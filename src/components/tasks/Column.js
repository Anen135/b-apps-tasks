'use client'

import { useEffect, useRef, useState } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Button } from '@/components/ui/button'
import { Plus, FolderOpen } from 'lucide-react'
import Task from './Task'
import clsx from 'clsx'

const COLUMN_MIN_WIDTH = 280

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

  const handleAddTask = () => onTaskCreate?.(columnId)

  // Измеряем высоты задач
  useEffect(() => {
    const newHeights = {}
    for (const id in taskRefs.current) {
      const el = taskRefs.current[id]
      if (el) newHeights[id] = el.offsetHeight
    }
    setTaskHeights(newHeights)
  }, [tasks])

  return (
    <div
      ref={setNodeRef}
      className={clsx(
        'rounded-xl p-4 shadow-sm bg-muted transition-colors flex flex-col',
        isOver && 'border-2 border-dashed border-primary'
      )}
      style={{ minWidth: COLUMN_MIN_WIDTH, flex: 1 }}
    >
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold truncate pr-2">{title}</h2>
        <Button size="icon" variant="ghost" onClick={handleAddTask}>
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-3">
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
            tasks.map((task) => (
              <Task
                key={task.id}
                id={task.id}
                content={task.content}
                activeId={activeId}
                onUpdate={(newContent) => onTaskUpdate(columnId, task.id, newContent)}
                onDelete={() => onTaskDelete(columnId, task.id)}
                ref={(el) => (taskRefs.current[task.id] = el)}
                isSkeleton={task.isSkeleton}
              />
            ))
          )}
        </div>
      </SortableContext>
    </div>
  )
}

export default Column
