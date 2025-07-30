'use client'

import { useEffect, useState, useCallback } from 'react'
import { DndContext, closestCenter, DragOverlay } from '@dnd-kit/core'
import Column from './Column'
import { useBoardHandlers } from '@/hooks/useBoardHandlers'
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable'

const Board = ({ onStatusChange }) => {
  const [columns, setColumns] = useState({})
  const [columnTitles, setColumnTitles] = useState({})
  const [activeTask, setActiveTask] = useState(null)
  const [status, setStatus] = useState('loading')
  const [layoutDirection, setLayoutDirection] = useState('horizontal') // адаптация к ориентации

  const updateStatus = useCallback((newStatus) => {
    setStatus(newStatus)
    onStatusChange?.(newStatus)
  }, [onStatusChange])

  const {
    handleTaskUpdate,
    handleTaskDelete,
    handleTaskCreate,
    handleDragEnd,
    getColumnByTaskId,
  } = useBoardHandlers({ columns, setColumns, updateStatus })

  useEffect(() => {
    const updateLayout = () => {
      const horizontal = window.innerWidth >= window.innerHeight
      setLayoutDirection(horizontal ? 'horizontal' : 'vertical')
    }

    updateLayout()
    window.addEventListener('resize', updateLayout)
    return () => window.removeEventListener('resize', updateLayout)
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        updateStatus('loading')
        const res = await fetch('/api/columns')
        const data = await res.json()

        const mapped = {}
        const titles = {}

        data.forEach(column => {
          titles[column.id] = column.title
          mapped[column.id] = column.tasks.map(task => ({
            id: task.id,
            content: task.content
          }))
        })

        setColumns(mapped)
        setColumnTitles(titles)
        updateStatus('idle')
      } catch (err) {
        console.error('Failed to fetch columns:', err)
        updateStatus('error')
      }
    }

    fetchData()
  }, [updateStatus])

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={({ active }) => {
        const fromColumnId = getColumnByTaskId(active.id)
        const task = columns[fromColumnId]?.find(t => t.id === active.id)
        if (task) setActiveTask(task)
      }}
      onDragEnd={(event) => {
        handleDragEnd(event)
        setActiveTask(null)
      }}
      onDragCancel={() => setActiveTask(null)}
    >
      <SortableContext
        items={Object.values(columns).flatMap(tasks => tasks.map(t => t.id))}
        strategy={rectSortingStrategy}
      >
        <div
          className="p-4 grid gap-6 items-start"
          style={{
            display: 'grid',
            gridTemplateColumns:
              layoutDirection === 'horizontal'
                ? 'repeat(auto-fit, minmax(280px, 1fr))'
                : '1fr',
            gridAutoFlow: layoutDirection === 'horizontal' ? 'row' : 'column',
            alignItems: 'stretch',
          }}
        >
          {Object.entries(columns).map(([columnId, tasks]) => (
            <Column
              key={columnId}
              columnId={columnId}
              title={columnTitles[columnId]}
              tasks={tasks}
              activeId={activeTask?.id}
              onTaskUpdate={handleTaskUpdate}
              onTaskDelete={handleTaskDelete}
              onTaskCreate={handleTaskCreate}
              direction={layoutDirection}
            />
          ))}
        </div>
      </SortableContext>

      <DragOverlay>
        {activeTask && (
          <div className="p-4 bg-white rounded-xl shadow-lg text-sm max-w-[280px] break-words">
            {activeTask.content}
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}

export default Board
