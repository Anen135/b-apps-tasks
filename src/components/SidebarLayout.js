'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function SidebarLayout({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  const sidebarWidth = 250;

  return (
    <div style={{ display: 'flex' }}>
      {/* Sidebar */}
      <div
        style={{
          width: isOpen ? `${sidebarWidth}px` : '0px',
          overflow: 'hidden',
          backgroundColor: '#111',
          color: '#fff',
          transition: 'width 0.3s ease',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#1c1c1c',
            padding: '15px',
            borderBottom: '1px solid #333',
          }}
        >
          <h2 style={{ margin: 0, fontSize: '18px' }}>Меню</h2>
          <button
            onClick={() => setIsOpen(false)}
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

        <ul style={{ listStyle: 'none', padding: '20px', margin: 0 }}>
          <li style={{ marginBottom: '10px' }}><Link href="/"              >Главная</Link>         </li>
          <li style={{ marginBottom: '10px' }}><Link href="/tasks/my-tasks">Мои задачи</Link>      </li>
          <li style={{ marginBottom: '10px' }}><Link href="/tasks"         >Задачи</Link>          </li>
          <li style={{ marginBottom: '10px' }}><Link href="/editor"        >Редактор</Link>        </li>
          <li style={{ marginBottom: '10px' }}><Link href="/test"          >Настройки</Link>       </li>
          <li style={{ marginBottom: '10px' }}><Link href="/test/api"      >Тест API</Link>        </li>
          <li style={{ marginBottom: '10px' }}><Link href="/login"         >Вход</Link>            </li>
        </ul>
      </div>

      {/* Контент + Кнопка открытия */}
      <div
        style={{
          flexGrow: 1,
          transition: 'margin-left 0.3s ease',
        }}
      >
        {/* Кнопка открытия, если меню закрыто */}
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            style={{
              position: 'absolute',
              top: 20,
              left: 20,
              zIndex: 10000,
              fontSize: '24px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            ☰
          </button>
        )}

        {children}
      </div>
    </div>
  );
}
