'use client';
import { useState, useEffect } from 'react';

export default function DataEditor({ row, onSave }) {
  // если row пустой → создаём пустой объект
  const [form, setForm] = useState(row || {});

  useEffect(() => {
    setForm(row || {}); // при обновлении row не даём упасть на null
  }, [row]);

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    onSave(form);
  };

  // Если данных нет — показываем заглушку
  if (!form || Object.keys(form).length === 0) {
    return (
      <div className="p-4 border rounded bg-white shadow text-gray-500">
        Нет данных для редактирования
      </div>
    );
  }

  return (
    <div className="p-4 border rounded bg-white shadow">
      {Object.keys(form).map(key => (
        <div key={key} className="mb-2">
          <label className="block text-sm mb-1">{key}</label>
          <input
            className="border p-2 rounded w-full"
            value={form[key] ?? ''} // подстраховка от undefined
            onChange={(e) => handleChange(key, e.target.value)}
          />
        </div>
      ))}
      <button
        onClick={handleSubmit}
        className="px-4 py-2 me-2 rounded bg-green-500 text-white hover:bg-green-600"
      >
        Сохранить
      </button>
      <button
        onClick={() => setForm(row || {})}
        className="px-4 py-2 rounded bg-gray-400 text-white hover:bg-gray-500"
      >
        Отмена
      </button>
    </div>
  );
}
