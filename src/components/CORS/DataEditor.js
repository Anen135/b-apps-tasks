'use client';
import { useState } from 'react';

export default function DataEditor({ row, onSave }) {
  const [form, setForm] = useState(row);

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    // универсальный PUT
    await fetch(`/api/data/${form.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    if (onSave) onSave(form);
  };

  return (
    <div className="p-4 border rounded bg-white shadow">
      {Object.keys(form).map(key => (
        <div key={key} className="mb-2">
          <label className="block text-sm mb-1">{key}</label>
          <input
            className="border p-2 rounded w-full"
            value={form[key]}
            onChange={(e) => handleChange(key, e.target.value)}
          />
        </div>
      ))}
      <button
        onClick={handleSubmit}
        className="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600"
      >
        Сохранить
      </button>
    </div>
  );
}
