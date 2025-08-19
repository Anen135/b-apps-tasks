'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FaBars, FaTimes } from 'react-icons/fa';

export default function SidebarLayout({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="flex relative">
      {/* Sidebar */}
      <div
        className={`
          min-h-screen
          overflow-hidden flex-shrink-0 z-10
          transition-[width] duration-300 ease-in-out
          ${isOpen ? 'w-64' : 'w-0'}
          bg-gradient-to-b from-[var(--sidebar-from)] to-[var(--sidebar-to)] text-[var(--sidebar-foreground)]
        `}
      >

        <div className="flex justify-between items-center px-4 py-3 border-b border-[var(--sidebar-border)]" >
          <h2 className="text-lg m-0">
            Меню
          </h2> 
          <button
            onClick={() => setIsOpen(false)}
            className="text-xl bg-transparent border-none cursor-pointer"
            aria-label="Закрыть меню"
          >
            <FaTimes />
          </button>
        </div>

        <ul className="list-none p-5 m-0">
          {[
            { href: '/', label: 'Главная' },
            { href: '/tasks/my-tasks', label: 'Мои задачи' },
            { href: '/tasks', label: 'Задачи' },
            { href: '/editor', label: 'Редактор' },
            { href: '/admin', label: 'Настройки' },
            { href: '/test', label: 'Тест' },
            { href: '/SerpenSys', label: 'СерпенСись' },
            { href: '/login', label: 'Вход' },
          ].map(({ href, label }) => (
            <li key={href} className="mb-2">
              <Link
                href={href}
                className="hover:underline"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Контент + Кнопка открытия */}
      <div className="flex-grow relative">

        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="absolute top-5 left-5 z-50 text-3xl bg-transparent border-none cursor-pointer text-[var(--sidebar-primary)]"
            aria-label="Открыть меню"
          >
            <FaBars />
          </button>
        )}
        {children}
      </div>
    </div>
  );
}
