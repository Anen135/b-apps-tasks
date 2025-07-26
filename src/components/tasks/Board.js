'use client'
// sourcery skip: use-braces
import { useState } from 'react'
import { DndContext, closestCenter } from '@dnd-kit/core'
import Column from './Column'
import { DragOverlay } from '@dnd-kit/core'

const initialTasks = {
  todo: [{ id: '1', content: 'Task 1' }, { id: '2', content: 'Task 2' }],
  inProgress: [{ id: '3', content: 'Task 3' }],
  done: [{ id: '4', content: 'Task 4' }]
}

const columnTitles = {
  todo: 'TODO',
  inProgress: 'In Progress',
  done: 'Done'
}

const Board = () => {
  const [columns, setColumns] = useState(initialTasks)
  const [activeTask, setActiveTask] = useState(null)


  const handleDragEnd = (event) => {
    const { active, over } = event
    if (!over) return

    const activeId = active.id
    const overId = over.id

    // Если перетаскиваем в пустую колонку
    if (Object.keys(columns).includes(overId)) {
      const fromColumnId = findColumnByTaskId(activeId)
      const toColumnId = overId
      if (!fromColumnId || fromColumnId === toColumnId) return

      const fromTasks = [...columns[fromColumnId]].filter(t => t.id !== activeId)
      const movedTask = columns[fromColumnId].find(t => t.id === activeId)
      const toTasks = [...columns[toColumnId], movedTask]

      setColumns({
        ...columns,
        [fromColumnId]: fromTasks,
        [toColumnId]: toTasks
      })
      return
    }

    // Перетаскивание между задачами
    const fromColumnId = findColumnByTaskId(activeId)
    const toColumnId = findColumnByTaskId(overId)

    if (!fromColumnId || !toColumnId) return

    if (fromColumnId === toColumnId) {
      const tasks = [...columns[fromColumnId]]
      const oldIndex = tasks.findIndex(t => t.id === activeId)
      const newIndex = tasks.findIndex(t => t.id === overId)

      const reordered = [...tasks]
      const [moved] = reordered.splice(oldIndex, 1)
      reordered.splice(newIndex, 0, moved)

      setColumns({
        ...columns,
        [fromColumnId]: reordered
      })
    } else {
      const fromTasks = [...columns[fromColumnId]].filter(t => t.id !== activeId)
      const movedTask = columns[fromColumnId].find(t => t.id === activeId)
      const toTasks = [...columns[toColumnId]]
      const overIndex = toTasks.findIndex(t => t.id === overId)
      toTasks.splice(overIndex + 1, 0, movedTask)

      setColumns({
        ...columns,
        [fromColumnId]: fromTasks,
        [toColumnId]: toTasks
      })
    }
  }

  const findColumnByTaskId = (taskId) => {
    return Object.keys(columns).find(key =>
      columns[key].some(task => task.id === taskId)
    )
  }

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={(event) => {
        const taskId = event.active.id
        const fromColumnId = findColumnByTaskId(taskId)
        const task = columns[fromColumnId]?.find(t => t.id === taskId)
        if (task) { setActiveTask(task) }
      }}
      onDragEnd={(event) => { handleDragEnd(event); setActiveTask(null); }}
      onDragCancel={() => setActiveTask(null)}
    >

      <div style={{ display: 'flex', gap: '20px', padding: '20px' }}>
        {Object.entries(columns).map(([columnId, tasks]) => (
          <Column
            key={columnId}
            columnId={columnId}
            title={columnTitles[columnId]}
            tasks={tasks}
          />
        ))}
      </div>
      <DragOverlay>
        {activeTask ? (
          <div
            style={{
              padding: '10px',
              backgroundColor: '#fff',
              borderRadius: '5px',
              boxShadow: '0 2px 5px rgba(0,0,0,0.15)'
            }}
          >
            {activeTask.content}
          </div>
        ) : null}
      </DragOverlay>

    </DndContext>
  )
}

export default Board
