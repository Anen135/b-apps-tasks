'use client';

import { useEffect, useState } from 'react';
import DataTable from '@/components/CORS/DataTable';
import DataEditor from '@/components/CORS/DataEditor';
import { Spinner } from '@/components/Loading';

export default function DemoUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingRow, setEditingRow] = useState(null);

  // загрузка пользователей
  const fetchUsers = async () => {
    setLoading(true);
    const res = await fetch('/api/users');
    const data = await res.json();
    setUsers(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // колонки таблицы
  const columns = [
    { key: 'login', label: 'Логин' },
    { key: 'nickname', label: 'Ник' },
    { key: 'email', label: 'Email' }, // у тебя email опциональный
    { key: 'color', label: 'Цвет', render: val => (
      <div className="flex items-center gap-2">
        <span 
          className="w-4 h-4 rounded-full border" 
          style={{ background: val }} 
        />
        {val}
      </div>
    ) },
    { key: 'tags', label: 'Теги', render: val => (
      <span className="text-sm text-gray-600">{val.join(', ')}</span>
    ) },
    { key: 'createdAt', label: 'Создан', render: val => (
      new Date(val).toLocaleDateString('ru-RU')
    ) }
  ];

  // сохранение изменений
  const handleSave = async (newRow) => {
    await fetch(`/api/users/${newRow.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newRow),
    });
    setEditingRow(null);
    fetchUsers(); // перезагружаем список
  };

  if (loading) return <Spinner />;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Демо: Пользователи</h1>

      <DataTable 
        data={users}
        columns={columns}
        itemsPerPage={5}
        onEdit={setEditingRow}
      />

      {editingRow && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Редактирование пользователя</h2>
          <DataEditor row={editingRow} onSave={handleSave} />
        </div>
      )}
    </div>
  );
}
