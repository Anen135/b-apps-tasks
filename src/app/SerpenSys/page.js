'use client';
import React from 'react';  
import { FaBars } from 'react-icons/fa';
import { useRouter } from 'next/router';
import { closestCorners, DndContext } from "@dnd-kit/core";
import Column from '@/components/SerpenSys/column';
import { useState } from "react";

export default function SerpenPage1() {
    const [tasks, setTasks] = useState([
        { id: 1, title: 'Task 1' },
        { id: 2, title: 'Task 2' }, 
        { id: 3, title: 'Task 3' },
        { id: 4, title: 'Task 4' },
    ]);

    return (
        <main className="flex flex-col items-center justify-center min-h-screen py-2 px-4 sm:px-6 lg:px-8">
            <h1>го ебаца</h1>

            <DndContext collisionDetection={closestCorners}>
                <Column tasks={tasks} />
            </DndContext>
        </main>
    )   
}