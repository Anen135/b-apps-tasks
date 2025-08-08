'use client'

import { useState } from 'react'

export default function AddBlockWidget({ onAdd }) {
    const [text, setText] = useState('')
    const [color, setColor] = useState('#007bff')
    const [textColor, setTextColor] = useState('#000000')

    const handleAdd = () => {
        if (text.trim()) {
            onAdd(text, color, textColor)
            setText('') // очистим текст
        }
    }

    return (
        <div className="fixed top-3 right-3 z-50 bg-white p-4 shadow-lg rounded-lg w-64 space-y-4 border border-gray-200">
            <h3 className="text-lg font-semibold">Добавить блок</h3>
            <div className="flex flex-col space-y-2">
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Текст блока"
                    className="border p-2 rounded"
                />
                <label className="text-sm font-medium">Цвет фона</label>
                <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-full h-10 rounded"
                />
                <label className="text-sm font-medium">Цвет текста</label>
                <input
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="w-full h-10 rounded"
                />
                <button
                    onClick={handleAdd}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                >
                    Добавить
                </button>
            </div>
        </div>
    )
}
