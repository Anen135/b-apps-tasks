"use client";

import NavPanel from "@/components/NavPanel";
import { FiHome, FiCpu, FiKey, FiAirplay, FiBox} from "react-icons/fi";

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
            href: "/test/dependencies",
            label: "Зависимости",
            description: "Тестирование зависимостей",
            icon: <FiAirplay size={24} />,
        },
        {
            href: "/test/s3",
            label: "S3",
            description: "Тестирование работы S3, baka",
            icon: <FiBox size={24} />,
        }
    ];

    return (
        <main className="pt-20 max-w-4xl mx-auto min-h-screen font-sans bg-transparent">
            <NavPanel links={links} />
        </main>
    );
}
