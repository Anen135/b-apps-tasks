'use client'
import Task from './Task'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable'

const Column = ({ title, columnId, tasks }) => {
  const { setNodeRef, isOver } = useDroppable({ id: columnId })

  return (
    <div
      ref={setNodeRef}
      style={{
        flex: 1,
        padding: '10px',
        backgroundColor: isOver ? '#e0e0e0' : '#f0f0f0',
        borderRadius: '8px',
        minHeight: '400px'
      }}
    >
      <h2>{title}</h2>
      <SortableContext items={tasks.map(t => t.id)} strategy={rectSortingStrategy}>
        {tasks.length === 0 ? (
          <div
            style={{
              height: '50px',
              border: '2px dashed #ccc',
              borderRadius: '5px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#aaa'
            }}
          >
            Drop here
          </div>
        ) : (
          tasks.map(task => (
            <Task key={task.id} id={task.id} content={task.content} />
          ))
        )}
      </SortableContext>
    </div>
  )
}

export default Column
