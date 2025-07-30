'use client'

import { useRef } from 'react'
import { useDroppable } from '@dnd-kit/core'
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
  activeTask,
  onTaskUpdate,
  onTaskDelete,
  onTaskCreate,
}) => {
  const { setNodeRef, isOver } = useDroppable({ id: columnId })
  const taskRefs = useRef({})

  const handleAddTask = () => onTaskCreate?.(columnId)
  const isActiveTaskInColumn = tasks.some(t => t.id === activeTask?.id)

  return (
    <div
      ref={setNodeRef}
      className={clsx(
        'rounded-2xl p-4 shadow-sm bg-muted transition-all flex flex-col relative overflow-hidden',
        isOver &&
          'ring-2 ring-primary/60 ring-offset-2 ring-offset-muted shadow-lg scale-[1.01]'
      )}
      style={{ minWidth: COLUMN_MIN_WIDTH, flex: 1 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold truncate pr-2 text-foreground">
          {title}
        </h2>
        <Button
          size="icon"
          variant="ghost"
          onClick={handleAddTask}
          className="hover:bg-primary/10 text-muted-foreground"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        {tasks.length === 0 ? (
          <div
            onClick={handleAddTask}
            className={clsx(
              'flex flex-col items-center justify-center gap-2 h-32 border-2 border-dashed rounded-xl text-muted-foreground cursor-pointer transition-colors duration-200',
              isOver
                ? 'border-primary/40 bg-muted/60'
                : 'border-muted-foreground/30 hover:bg-muted/40'
            )}
          >
            <FolderOpen className="w-6 h-6" />
            <span className="text-sm">Пусто — нажмите, чтобы добавить</span>
          </div>
        ) : (
          <>
            {tasks.map((task) => (
              <Task
                key={task.id}
                id={task.id}
                content={task.content}
                activeId={activeId}
                onUpdate={(newContent) =>
                  onTaskUpdate(columnId, task.id, newContent)
                }
                onDelete={() => onTaskDelete(columnId, task.id)}
                ref={(el) => (taskRefs.current[task.id] = el)}
                isSkeleton={task.isSkeleton}
              />
            ))}

            {isOver && activeTask && !isActiveTaskInColumn && (
              <Task
                key={activeTask.id}
                id={activeTask.id}
                content={activeTask.content}
                activeId={activeId}
                isSkeleton={activeTask.isSkeleton}
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Column
