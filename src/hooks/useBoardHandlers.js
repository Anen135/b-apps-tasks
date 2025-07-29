// sourcery skip: use-braces
// hooks/useBoardHandlers.js
'use client'
import { useCallback } from 'react'

export const useBoardHandlers = ({ columns, setColumns, updateStatus, findColumnByTaskId }) => {
    const handleTaskUpdate = async (columnId, taskId, newContent) => {
        updateStatus('saving')
        try {
            await fetch(`/api/tasks/${taskId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: newContent })
            })

            setColumns(prev => {
                const updated = { ...prev }
                updated[columnId] = updated[columnId].map(task =>
                    task.id === taskId ? { ...task, content: newContent } : task
                )
                return updated
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
            await fetch(`/api/tasks/${taskId}`, { method: 'DELETE' })

            setColumns(prev => {
                const updated = { ...prev }
                updated[columnId] = updated[columnId].filter(task => task.id !== taskId)
                return updated
            })

            updateStatus('saved')
            setTimeout(() => updateStatus('idle'), 1000)
        } catch (err) {
            console.error('Failed to delete task:', err)
            updateStatus('error')
        }
    }

    const handleTaskCreate = async (columnId) => {
        updateStatus('saving')
        try {
            const res = await fetch('/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: '',
                    position: 0,
                    columnId
                })
            })

            const newTask = await res.json()

            setColumns(prev => {
                const updated = { ...prev }
                updated[columnId] = [newTask, ...(updated[columnId] || [])]
                return updated
            })

            updateStatus('saved')
            setTimeout(() => updateStatus('idle'), 1000)
        } catch (err) {
            console.error('Failed to create task:', err)
            updateStatus('error')
        }
    }

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
        updateStatus('saving')

        try {
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
    }
}
