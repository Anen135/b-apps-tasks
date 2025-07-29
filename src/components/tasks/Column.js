'use client'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable'
import Task from './Task'

const Column = ({ title, columnId, tasks, activeId, onTaskUpdate, onTaskDelete, onTaskCreate }) => {
  const { setNodeRef, isOver } = useDroppable({ id: columnId })

  const handleAddTask = () => {
    if (onTaskCreate) {
      onTaskCreate(columnId)
    }
  }

  const handleDropClick = () => {
    if (onTaskCreate) {
      onTaskCreate(columnId)
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={{
        flex: 1,
        padding: '10px',
        backgroundColor: isOver ? '#e0e0e0' : '#f0f0f0',
        borderRadius: '8px',
        minHeight: '400px',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '10px'
      }}>
        <h2 style={{ margin: 0 }}>{title}</h2>
        <button
          onClick={handleAddTask}
          style={{
            backgroundColor: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            padding: '4px 8px',
            cursor: 'pointer',
            fontSize: '18px'
          }}
          title="Добавить задачу"
        >
          +
        </button>
      </div>

      {/* Task list */}
      <SortableContext items={tasks.map(t => t.id)} strategy={rectSortingStrategy}>
        {tasks.length === 0 ? (
          <div
            onClick={handleDropClick}
            style={{
              height: '50px',
              border: '2px dashed #ccc',
              borderRadius: '5px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#aaa',
              cursor: 'pointer'
            }}
          >
            Drop here
          </div>
        ) : (
          tasks.map(task => (
            <Task
              key={task.id}
              id={task.id}
              content={task.content}
              activeId={activeId}
              onUpdate={(newContent) => onTaskUpdate(columnId, task.id, newContent)}
              onDelete={() => onTaskDelete(columnId, task.id)}
            />
          ))
        )}
      </SortableContext>
    </div>
  )
}

export default Column
