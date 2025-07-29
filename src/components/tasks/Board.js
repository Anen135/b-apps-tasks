// sourcery skip: use-braces
// app/components/Board.js
'use client'
import { useState, useEffect, useCallback } from 'react'
import { DndContext, closestCenter, DragOverlay } from '@dnd-kit/core'
import Column from './Column'
import { useBoardHandlers } from '@/hooks/useBoardHandlers'

const Board = ({ onStatusChange }) => {
  const [columns, setColumns] = useState({})
  const [columnTitles, setColumnTitles] = useState({})
  const [activeTask, setActiveTask] = useState(null)
  const [status, setStatus] = useState('loading')

  const updateStatus = useCallback((newStatus) => {
    setStatus(newStatus)
    onStatusChange?.(newStatus)
  }, [onStatusChange])

  const findColumnByTaskId = useCallback((taskId) => {
    return Object.keys(columns).find(key =>
      columns[key].some(task => task.id === taskId)
    )
  }, [columns])

  const {
    handleTaskUpdate,
    handleTaskDelete,
    handleTaskCreate,
    handleDragEnd,
  } = useBoardHandlers({ columns, setColumns, updateStatus, findColumnByTaskId })

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
        const fromColumnId = findColumnByTaskId(active.id)
        const task = columns[fromColumnId]?.find(t => t.id === active.id)
        if (task) setActiveTask(task)
      }}
      onDragEnd={(event) => {
        handleDragEnd(event)
        setActiveTask(null)
      }}
      onDragCancel={() => setActiveTask(null)}
    >
      <div style={{ display: 'flex', gap: '20px', padding: '20px' }}>
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
          />
        ))}
      </div>

      <DragOverlay>
        {activeTask && (
          <div style={{
            padding: '10px',
            backgroundColor: '#fff',
            borderRadius: '5px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.15)'
          }}>
            {activeTask.content}
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}

export default Board