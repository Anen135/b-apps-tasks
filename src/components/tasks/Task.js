// sourcery skip: use-braces
'use client'

import { forwardRef, useState, useImperativeHandle } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Pencil, Trash2, Copy } from 'lucide-react'
import clsx from 'clsx'
import { toast } from 'sonner'

// Оборачиваем в forwardRef
const Task = forwardRef(({ id, content, activeId, onUpdate, onDelete }, externalRef) => {
  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = useState(content)
  const [isHovering, setIsHovering] = useState(false)
  const [isHoveringButtons, setIsHoveringButtons] = useState(false)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id })

  // Прокидываем ref наверх
  const combinedRef = (node) => {
    setNodeRef(node)
    if (typeof externalRef === 'function') {
      externalRef(node)
    } else if (externalRef) {
      externalRef.current = node
    }
  }

  const shouldEnableDrag = !isEditing && !isHoveringButtons

  const saveEdit = () => {
    setIsEditing(false)
    if (value !== content) {
      onUpdate?.(value)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') saveEdit()
    if (e.key === 'Escape') {
      setValue(content)
      setIsEditing(false)
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content)
      toast.success('Скопировано в буфер обмена')
    } catch (err) {
      toast.error('Ошибка при копировании')
      console.error('Ошибка копирования:', err)
    }
  }

  return (
    <div
      ref={combinedRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: id === activeId ? 0 : 1,
      }}
      className={clsx(
        'relative bg-white rounded-xl p-4 shadow-sm text-sm break-words',
        'transition-opacity duration-200',
        'hover:shadow-md',
        'select-none',
        isDragging && 'opacity-50'
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      {...attributes}
      {...(shouldEnableDrag ? listeners : {})}
    >
      {isEditing ? (
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={saveEdit}
          onKeyDown={handleKeyDown}
          autoFocus
          className="w-full bg-transparent outline-none border-none text-sm select-text"
        />
      ) : (
        <>
          <div className="whitespace-pre-wrap break-words pr-12">{content}</div>

          {/* Buttons */}
          <div
            className={clsx(
              'absolute right-2 top-2 flex gap-2 items-center transition-opacity',
              isHovering ? 'opacity-100' : 'opacity-0'
            )}
            onMouseEnter={() => setIsHoveringButtons(true)}
            onMouseLeave={() => setIsHoveringButtons(false)}
          >
            <button onClick={handleCopy} title="Копировать">
              <Copy className="w-4 h-4 text-muted-foreground hover:text-primary" />
            </button>
            <button onClick={() => setIsEditing(true)} title="Редактировать">
              <Pencil className="w-4 h-4 text-muted-foreground hover:text-primary" />
            </button>
            <button onClick={onDelete} title="Удалить">
              <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
            </button>
          </div>
        </>
      )}
    </div>
  )
})

Task.displayName = 'Task'
export default Task
