"use client";

import NavPanel from "@/components/NavPanel";
import { FiHome, FiTag, FiUser } from "react-icons/fi";
import ParticlesAnimation from '@/components/login/ParticlesAnimation';
export default function AdminPage() {
  const links = [
    {
      href: "/",
      label: "Главная",
      description: "Переход на главную страницу",
      icon: <FiHome size={24} />,
    },
    {
      href: "/admin/getTag",
      label: "Выдать тег",
      description: "Выдать тег кому-то",
      icon: <FiTag size={24} />,
    },
    {
      href: "/admin/tasksCRUD",
      label: "Задачи",
      description: "Управление задачами",
      icon: <FiUser size={24} />,
    },
    {
      href: "/admin/user-page",
      label: "Таблица пользователя",
      description: "Просмотреть данные пользователя",
      icon: <FiTag size={24} />,
    }
  ];

  return (
    <main className="py-20 px-5 sm:px-3 max-w-4xl mx-auto min-h-screen font-sans text-foreground">
      <NavPanel links={links} />
      
    </main>
  );
}
