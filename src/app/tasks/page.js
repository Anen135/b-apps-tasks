'use client';

import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';


const columns = ['To Do', 'In Progress', 'Done'];
export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const addTask = () => {
    if (input.trim()) {
      setTasks([...tasks, { id: Date.now().toString(), title: input, status: 'To Do' }]);
      setInput('');
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    // sourcery skip: use-braces
    if (!over || active.id === over.id) return;
    setTasks((prev) =>
      prev.map((task) =>
        task.id === active.id ? { ...task, status: over.id } : task
      )
    );
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📋 Task Board</h1>

      <div className="flex gap-2 mb-4">
        <Input
          placeholder="New task..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <Button onClick={addTask}>Add</Button>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-3 gap-6">
          {columns.map((col) => (
            <div key={col} className="bg-gray-100 p-4 rounded-xl shadow-sm min-h-[300px]">
              <h2 className="font-semibold text-lg mb-2">{col}</h2>
              <SortableContext items={tasks.filter(t => t.status === col).map(t => t.id)} strategy={verticalListSortingStrategy}>
                <div className="flex flex-col gap-2">
                  {tasks
                    .filter((task) => task.status === col)
                    .map((task) => (
                      <SortableItem key={task.id} id={task.id} task={task} />
                    ))}
                </div>
              </SortableContext>
            </div>
          ))}
        </div>
      </DndContext>
    </div>
  );
}
