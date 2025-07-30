'use client'

import { useEffect, useState, useCallback } from 'react'
import { DndContext, closestCenter, DragOverlay } from '@dnd-kit/core'
import Column from './Column'
import { useBoardHandlers } from '@/hooks/useBoardHandlers'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

const Board = ({ onStatusChange }) => {
  const [columns, setColumns] = useState({})
  const [columnTitles, setColumnTitles] = useState({})
  const [activeTask, setActiveTask] = useState(null)
  const [activeTaskSize, setActiveTaskSize] = useState(null)
  const [status, setStatus] = useState('loading')
  const [layoutDirection, setLayoutDirection] = useState('horizontal')

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
      setLayoutDirection(window.innerWidth >= window.innerHeight ? 'horizontal' : 'vertical')
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
          mapped[column.id] = column.tasks.map(task => ({ id: task.id, content: task.content }))
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

  const handleDragOver = ({ active, over }) => {
    const activeId = active?.id
    const overId = over?.id
    if (!activeId || !overId) return

    const fromColumnId = getColumnByTaskId(activeId)
    const toColumnId = overId.startsWith('column-') ? overId.replace('column-', '') : getColumnByTaskId(overId)

    if (!fromColumnId || !toColumnId || fromColumnId === toColumnId) return

    setColumns(prev => {
      const task = prev[fromColumnId].find(t => t.id === activeId)
      if (!task) return prev

      return {
        ...prev,
        [fromColumnId]: prev[fromColumnId].filter(t => t.id !== activeId),
        [toColumnId]: [...prev[toColumnId], task]
      }
    })
  }

  const handleDragStart = ({ active }) => {
    const fromColumnId = getColumnByTaskId(active.id)
    const task = columns[fromColumnId]?.find(t => t.id === active.id)
    if (task) {
      setActiveTask(task)

      const node = document.querySelector(`[data-task-id="${active.id}"]`)
      if (node) {
        const { width, height } = node.getBoundingClientRect()
        setActiveTaskSize({ width, height })
      }
    }
  }

  const resetActiveTask = () => {
    setActiveTask(null)
    setActiveTaskSize(null)
  }

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={(event) => {
        handleDragEnd(event)
        resetActiveTask()
      }}
      onDragCancel={resetActiveTask}
    >
<SortableContext
  items={Object.keys(columns)} // список колонок
  strategy={verticalListSortingStrategy} // или вертикальный, если нужно
>

        <div
          className="p-4 grid gap-6 items-start"
          style={{
            display: 'grid',
            gridTemplateColumns: layoutDirection === 'horizontal' ? 'repeat(auto-fit, minmax(280px, 1fr))' : '1fr',
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
          <div
            className="p-4 bg-white rounded-xl shadow-lg text-sm break-words"
            style={{
              width: activeTaskSize?.width,
              height: activeTaskSize?.height,
            }}
          >
            {activeTask.content}
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}

export default Board
