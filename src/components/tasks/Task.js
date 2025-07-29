// sourcery skip: use-braces
'use client'
import { useState, useRef } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const Task = ({ id, content, activeId, onUpdate, onDelete}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = useState(content)
  const [isHoveringButtons, setIsHoveringButtons] = useState(false)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    padding: '10px',
    backgroundColor: '#fff',
    marginBottom: '10px',
    borderRadius: '5px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    cursor: isEditing ? 'text' : 'grab',
    opacity: id === activeId ? 0 : 1,
    position: 'relative'
  }

  const saveEdit = async () => {
    setIsEditing(false)
    if (value !== content) {
      try {
        await fetch(`/api/tasks/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: value })
        })
        onUpdate?.(value) // <<< обновить родителя
      } catch (err) {
        console.error('Failed to update content', err)
      }
    }
  }

  const deleteTask = async () => {
    try {
      await fetch(`/api/tasks/${id}`, { method: 'DELETE' })
      onDelete?.() // <<< удалить из колонки в родителе
    } catch (err) {
      console.error('Failed to delete task', err)
    }
  }

  const shouldEnableDrag = !isEditing && !isHoveringButtons

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...(shouldEnableDrag ? listeners : {})}
    >
      {isEditing ? (
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={saveEdit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') saveEdit()
            if (e.key === 'Escape') {
              setValue(content)
              setIsEditing(false)
            }
          }}
          autoFocus
          style={{
            width: '100%',
            border: 'none',
            outline: 'none',
            background: 'transparent',
            fontSize: '1rem'
          }}
        />
      ) : (
        <>
          {content}
          <div
            style={{
              position: 'absolute',
              right: '8px',
              top: '8px',
              display: 'flex',
              gap: '6px'
            }}
            onMouseEnter={() => setIsHoveringButtons(true)}
            onMouseLeave={() => setIsHoveringButtons(false)}
          >
            <button onClick={() => setIsEditing(true)} style={btnStyle} title="Редактировать">✏️</button>
            <button onClick={deleteTask} style={btnStyle} title="Удалить">🗑</button>
          </div>
        </>
      )}
    </div>
  )
}

const btnStyle = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: '2px',
  fontSize: '0.9rem'
}

export default Task
