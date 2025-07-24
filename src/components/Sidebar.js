'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Кнопка открытия меню */}
      {!isOpen && (
        <button
          onClick={toggleSidebar}
          style={{
            position: 'fixed',
            top: 20,
            left: 20,
            zIndex: 1000,
            background: 'transparent',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            color: '#000',
          }}
        >
          ☰
        </button>
      )}

      {/* Сайдбар */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '250px',
            height: '100%',
            backgroundColor: '#111',
            color: '#fff',
            zIndex: 999,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Хедер меню */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#1c1c1c',
              padding: '15px 20px',
              borderBottom: '1px solid #333',
            }}
          >
            <h2 style={{ margin: 0, fontSize: '18px' }}>Меню</h2>
            <button
              onClick={toggleSidebar}
              style={{
                background: 'transparent',
                color: '#fff',
                border: 'none',
                fontSize: '20px',
                cursor: 'pointer',
              }}
            >
              ✖
            </button>
          </div>

          {/* Навигация */}
          <ul style={{ listStyle: 'none', padding: '20px', margin: 0 }}>
            <li style={{ marginBottom: '10px' }}><Link href="/">Главная</Link></li>
            <li style={{ marginBottom: '10px' }}><Link href="/tasks">Доска</Link></li>
            <li style={{ marginBottom: '10px' }}><Link href="/editor">Редактор</Link></li>
            <li style={{ marginBottom: '10px' }}><Link href="/login">Войти</Link></li>
          </ul>
        </div>
      )}
    </>
  );
}
