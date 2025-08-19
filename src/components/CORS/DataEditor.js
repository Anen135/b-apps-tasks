'use client';
import { useState, useEffect } from 'react';

// Рекурсивный компонент
function FieldEditor({ value, onChange }) {
  // Если массив → рендерим список
  if (Array.isArray(value)) {
    return (
      <div className="pl-4 border-l">
        {value.map((item, idx) => (
          <div key={idx} className="mb-2">
            <FieldEditor
              value={item}
              onChange={(newVal) => {
                const copy = [...value];
                copy[idx] = newVal;
                onChange(copy);
              }}
            />
          </div>
        ))}
        <button
          className="px-2 py-1 mt-2 rounded bg-blue-500 text-white"
          onClick={() => onChange([...value, ''])}
        >
          + Элемент
        </button>
      </div>
    );
  }

  // Если объект → рендерим словарь
  if (value && typeof value === 'object') {
    const addKey = () => {
      const newKey = prompt('Введите новый ключ');
      if (newKey && !value.hasOwnProperty(newKey)) {
        onChange({ ...value, [newKey]: '' });
      }
    };

    return (
      <div className="pl-4 border-l">
        {Object.keys(value).map((k) => (
          <div key={k} className="mb-2">
            <label className="block text-sm mb-1">{k}</label>
            <FieldEditor
              value={value[k]}
              onChange={(newVal) => onChange({ ...value, [k]: newVal })}
            />
          </div>
        ))}
        <button
          className="px-2 py-1 mt-2 rounded bg-purple-500 text-white"
          onClick={addKey}
        >
          + Ключ
        </button>
      </div>
    );
  }

  // Базовый инпут
  return (
    <input
      className="border p-2 rounded w-full"
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

export default function DataEditor({ row, onSave }) {
  const [form, setForm] = useState(row || {});

  useEffect(() => {
    setForm(row || {});
  }, [row]);

  const handleSubmit = async () => {
    onSave(form);
  };

  if (!form || Object.keys(form).length === 0) {
    return (
      <div className="p-4 border rounded bg-white shadow text-gray-500">
        Нет данных для редактирования
      </div>
    );
  }

  return (
    <div className="p-4 border rounded bg-white shadow">
      {Object.keys(form).map((key) => (
        <div key={key} className="mb-4">
          <label className="block text-sm mb-1 font-semibold">{key}</label>
          <FieldEditor
            value={form[key]}
            onChange={(newVal) => setForm((prev) => ({ ...prev, [key]: newVal }))}
          />
        </div>
      ))}

      <div className="mt-4">
        <button
          onClick={handleSubmit}
          className="px-4 py-2 me-2 rounded bg-green-500 text-white hover:bg-green-600"
        >
          Сохранить
        </button>
        <button
          onClick={() => setForm(null)}
          className="px-4 py-2 rounded bg-gray-400 text-white hover:bg-gray-500"
        >
          Отмена
        </button>
      </div>
    </div>
  );
}