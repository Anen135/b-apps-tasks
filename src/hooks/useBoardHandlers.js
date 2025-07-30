// sourcery skip: use-braces
// hooks/useBoardHandlers.js
'use client'
import { useCallback } from 'react'

export const useBoardHandlers = ({ columns, setColumns, updateStatus }) => {

    const getColumnByTaskId = useCallback((taskId) => {
        return Object.keys(columns).find(key =>
            columns[key].some(task => task.id === taskId)
        )
    }, [columns])


    const handleTaskUpdate = async (columnId, taskId, newContent) => {
        updateStatus('saving')
        try {
            setColumns(prev => {
                const updated = { ...prev }
                updated[columnId] = updated[columnId].map(task =>
                    task.id === taskId ? { ...task, content: newContent } : task
                )
                return updated
            })
            await fetch(`/api/tasks/${taskId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: newContent })
            })
            updateStatus('saved')
            setTimeout(() => updateStatus('idle'), 1000)
        } catch (err) {
            console.error('Failed to update task:', err)
            updateStatus('error')
        }
    }

    const handleTaskDelete = async (columnId, taskId) => {
        updateStatus('saving')
        try {
            setColumns(prev => {
                const updated = { ...prev }
                updated[columnId] = updated[columnId].filter(task => task.id !== taskId)
                return updated
            })
            await fetch(`/api/tasks/${taskId}`, { method: 'DELETE' })
            updateStatus('saved')
            setTimeout(() => updateStatus('idle'), 1000)
        } catch (err) {
            console.error('Failed to delete task:', err)
            updateStatus('error')
        }
    }

    const handleTaskCreate = async (columnId) => {
        updateStatus('saving');

        const tempId = `temp-${Date.now()}`;
        const skeletonTask = {
            id: tempId,
            content: 'Новая запись',
        };

        // 1. Добавляем skeleton в колонку
        setColumns(prev => {
            const updated = { ...prev };
            updated[columnId] = [skeletonTask, ...(updated[columnId] || [])];
            return updated;
        });

        try {
            // 2. Отправляем запрос
            const res = await fetch('/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: 'Новая запись',
                    position: 0,
                    columnId
                })
            });

            const newTask = await res.json();

            // 3. Заменяем skeleton на настоящую задачу
            setColumns(prev => {
                const updated = { ...prev };
                updated[columnId] = updated[columnId].map(task =>
                    task.id === tempId ? newTask : task
                );
                return updated;
            });

            updateStatus('saved');
            setTimeout(() => updateStatus('idle'), 1000);
        } catch (err) {
            console.error('Failed to create task:', err);

            // 4. Удаляем skeleton при ошибке
            setColumns(prev => {
                const updated = { ...prev };
                updated[columnId] = updated[columnId].filter(task => task.id !== tempId);
                return updated;
            });

            updateStatus('error');
        }
    };


    const handleDragEnd = async ({ active, over }) => {
  if (!over) return

  const activeId = active.id
  const overId = over.id

  const fromColumnId = getColumnByTaskId(activeId)
  const toColumnId = getColumnByTaskId(overId) || overId
  const movedTask = columns[fromColumnId]?.find(t => t.id === activeId)

  if (!fromColumnId || !toColumnId || !movedTask) return

  const updatedColumns = { ...columns }

  // Удаляем из старой позиции
  updatedColumns[fromColumnId] = updatedColumns[fromColumnId].filter(t => t.id !== activeId)

  // Вставка
  const targetTasks = updatedColumns[toColumnId] || []
  const overIndex = targetTasks.findIndex(t => t.id === overId)

  if (overIndex >= 0) {
    // Определяем направление перемещения
    const isSameColumn = fromColumnId === toColumnId
    const fromIndex = columns[fromColumnId].findIndex(t => t.id === activeId)
    const insertBefore = !isSameColumn || fromIndex > overIndex

    const insertAt = insertBefore ? overIndex : overIndex + 1
    updatedColumns[toColumnId] = [
      ...targetTasks.slice(0, insertAt),
      movedTask,
      ...targetTasks.slice(insertAt),
    ]
  } else {
    // если перетаскиваем на пустую колонку
    updatedColumns[toColumnId] = [...targetTasks, movedTask]
  }

  setColumns(updatedColumns)
  updateStatus('saving')

  try {
    const updatePromises = Array.from(new Set([fromColumnId, toColumnId]))
      .map(colId =>
        updatedColumns[colId].map((task, idx) =>
          updateTask({ ...task, columnId: colId, position: idx })
        )
      )
      .flat()

    await Promise.all(updatePromises)
    updateStatus('saved')
    setTimeout(() => updateStatus('idle'), 1000)
  } catch {
    updateStatus('error')
  }
}



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


    return {
        handleTaskUpdate,
        handleTaskDelete,
        handleTaskCreate,
        handleDragEnd,
        getColumnByTaskId,
    }
}
