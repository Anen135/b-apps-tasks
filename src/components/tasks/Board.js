// sourcery skip: use-braces
'use client'
import { useState, useEffect, useCallback } from 'react'
import { DndContext, closestCenter, DragOverlay } from '@dnd-kit/core'
import Column from './Column'

const Board = ({ onStatusChange }) => {
  const [columns, setColumns] = useState({})
  const [columnTitles, setColumnTitles] = useState({})
  const [activeTask, setActiveTask] = useState(null)
  const [status, setStatus] = useState('loading')

  const updateStatus = useCallback((newStatus) => {
    setStatus(newStatus)
    onStatusChange?.(newStatus)
  }, [onStatusChange])

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

  const updateTask = async (task) => {
    try {
      await fetch(`/api/tasks/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: task.content,
          columnId: task.columnId,
          position: task.position
        })
      })
    } catch (err) {
      console.error('Error updating task:', task, err)
      updateStatus('error')
    }
  }

  const findColumnByTaskId = (taskId) =>
    Object.keys(columns).find(key =>
      columns[key].some(task => task.id === taskId)
    )

  const handleDragEnd = async ({ active, over }) => {
    if (!over) return

    const activeId = active.id
    const overId = over.id

    const fromColumnId = findColumnByTaskId(activeId)
    const toColumnId = findColumnByTaskId(overId) || overId
    const movedTask = columns[fromColumnId]?.find(t => t.id === activeId)

    if (!fromColumnId || !toColumnId || !movedTask) return
    if (fromColumnId === toColumnId && activeId === overId) return

    let updatedColumns = { ...columns }

    // Remove from source
    updatedColumns[fromColumnId] = updatedColumns[fromColumnId].filter(t => t.id !== activeId)

    // Insert into destination
    const insertIndex = updatedColumns[toColumnId]?.findIndex(t => t.id === overId) ?? -1
    if (insertIndex >= 0) {
      updatedColumns[toColumnId].splice(insertIndex + 1, 0, movedTask)
    } else {
      updatedColumns[toColumnId] = [...updatedColumns[toColumnId], movedTask]
    }

    setColumns(updatedColumns)

    // Update DB
    updateStatus('saving')

    try {
      // Обновляем все задачи в обеих колонках с позициями
      const updatePromises = [fromColumnId, toColumnId].map(colId =>
        updatedColumns[colId].map((task, idx) =>
          updateTask({
            id: task.id,
            content: task.content,
            columnId: colId,
            position: idx
          })
        )
      ).flat()

      await Promise.all(updatePromises)

      updateStatus('saved')
      setTimeout(() => updateStatus('idle'), 1000)
    } catch {
      updateStatus('error')
    }
  }

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
