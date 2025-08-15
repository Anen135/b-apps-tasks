'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FaBars, FaTimes } from 'react-icons/fa';

export default function SidebarLayout({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="flex relative" style={{ backgroundColor: '#0f0c29' }}>
      {/* Sidebar */}
      <div
        className={`
          text-white overflow-hidden flex-shrink-0 transition-width duration-300 ease-in-out z-10
          ${isOpen ? 'w-64' : 'w-0'}
        `}
        style={{
          transitionProperty: 'width',
          background: 'linear-gradient(180deg, #250042 0%, #000000 100%)',
          color: '#aaccff',
        }}
      >
        <div
          className="flex justify-between items-center px-4 py-3 border-b"
          style={{ borderColor: '#3a007a' }}
        >
          <h2 className="text-lg m-0" style={{ color: '#aaccff' }}>
            Меню
          </h2> 
          <button
            onClick={() => setIsOpen(false)}
            className="text-xl bg-transparent border-none cursor-pointer"
            aria-label="Закрыть меню"
            style={{ color: '#aaccff' }}
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
                style={{ color: '#aaccff' }}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Контент + Кнопка открытия */}
      <div className='sparkle'/>
      <div
        className="flex-grow transition-margin duration-300 ease-in-out relative bg-gradient-to-b from-[#250042] to-black"
        style={{ backgroundColor: '#0f0c29', color: '#aaccff' }}
      >
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="absolute top-5 left-5 z-50 text-3xl bg-transparent border-none cursor-pointer"
            aria-label="Открыть меню"
            style={{ color: '#aaccff' }}
          >
            <FaBars />
          </button>
        )}
        {children}
      </div>
    </div>
  );
}
