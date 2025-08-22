'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FaBars, FaTimes } from 'react-icons/fa';
import { useSession } from 'next-auth/react';
import {
  MdHome,
  MdCheckCircle,
  MdClipboard,
  MdEdit,
  MdSettings,
  MdInventory,
  MdQueryStats,
  MdArticle,
  MdLogin,
} from 'react-icons/md';

export default function SidebarLayout({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  const links = [
    { href: '/', label: 'Главная', icon: <MdHome /> },
    { href: '/tasks/my-tasks', label: 'Мои задачи', icon: <MdCheckCircle /> },
    { href: '/tasks', label: 'Задачи', tag: 'viewer', icon: <MdClipboard /> },
    { href: '/editor', label: 'Редактор', tag: 'editor', icon: <MdEdit /> },
    { href: '/admin', label: 'Настройки', tag: 'admin', icon: <MdSettings /> },
    { href: '/test', label: 'Тест', icon: <MdInventory /> },
    { href: '/SerpenSys', label: 'СерпенСись', tag: 'serpensys', icon: <MdQueryStats /> },
    { href: '/news', label: 'Новости', icon: <MdArticle /> },
    { href: '/login', label: 'Вход', icon: <MdLogin /> },
  ];
  const filteredLinks = links.filter(link => {
    if (!link.tag) return true;
    return session?.user?.tags?.includes(link.tag);
  });
  return (
    <div className="flex relative">
      {/* Sidebar */}
      <div
        className={`
          min-h-screen
          transition-[width] duration-200 ease-out
          bg-gradient-to-b from-[var(--sidebar-from)] to-[var(--sidebar-to)] text-[var(--sidebar-foreground)]
          ${isOpen ? 'w-64 flex-shrink-0 sidebar-open' : 'w-0 overflow-hidden'}
          fixed top-0 left-0 z-50 md:relative md:z-10 
        `}
      >
        <div className="sticky top-0 flex justify-between items-center px-4 py-3 border-b border-[var(--sidebar-border)]" >
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

        <ul className="sticky top-12 list-none p-5 m-0">
          {filteredLinks.map(({ href, label, icon = null }) => (
            <li key={href} className="mb-2">
              <Link
                href={href}
                className="hover:underline flex items-center gap-2 text-[var(--sidebar-foreground)]"
              >
                {icon}
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
            className="sticky top-0 left-0 p-3 rounded-br-lg z-100 text-2xl bg-[var(--sidebar-primary)] border-none cursor-pointer text-white"
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
