"use client";

import NavPanel from "@/components/NavPanel";
import { FiHome, FiCpu, FiKey } from "react-icons/fi";

export default function Page() {
    const links = [
        {
            href: "/",
            label: "Главная",
            description: "Переход на главную страницу",
            icon: <FiHome size={24} />,
        },
        {
            href: "/test/api",
            label: "API",
            description: "Автоматический тест API путей",
            icon: <FiCpu size={24} />,
        },
        {
            href: "/test/JWT",
            label: "JWT",
            description: "Инструменты тестирования JWT",
            icon: <FiKey size={24} />,
        },
        {
            href: "/test",
            label: "Основное меню тестирования",
            description: "Ты находишься здесь, baka",
            icon: <FiKey size={24} />,
        }
    ];

    return (
        <main className="p-20 max-w-4xl mx-auto min-h-screen font-sans bg-background text-foreground">
            <NavPanel links={links} />
        </main>
    );
}
