'use client'

import { useState, useEffect } from 'react'

export default function BlockSettingsPanel({ block, onUpdate, onDelete }) {
    const [text, setText] = useState(block.text)
    const [color, setColor] = useState(block.color)
    const [textColor, setTextColor] = useState(block.textColor || '#000000')

    useEffect(() => {
        setText(block.text)
        setColor(block.color)
        setTextColor(block.textColor || '#000000')
    }, [block])

    const handleApply = () => {
        onUpdate({ text, color, textColor })
    }

    return (
        <div className="z-20 bg-white shadow-lg border p-4 rounded w-72 space-y-4">
            <h2 className="text-lg font-semibold">Настройки блока</h2>
            <div className="space-y-2">
                <label className="block text-sm font-medium">Текст</label>
                <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full border p-2 rounded"
                />

                <label className="block text-sm font-medium">Цвет фона</label>
                <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full h-10 rounded"
                />

                <label className="block text-sm font-medium">Цвет текста</label>
                <input
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="w-full h-10 rounded"
                />
            </div>

            <div className="flex justify-between pt-2">
                <button
                onClick={handleApply}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                Применить
                </button>

                <button
                onClick={onDelete}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                Удалить
                </button>
            </div>
        </div>
    )
}
