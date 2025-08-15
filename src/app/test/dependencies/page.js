"use client";

import NavPanel from "@/components/NavPanel";
import Breadcrumbs from "@/components/Breadcrumbs";
import { FiHome, FiKey, FiCrosshair} from "react-icons/fi";

export default function Page() {
    const links = [
        {
            href: "/",
            label: "Главная",
            description: "Переход на главную страницу",
            icon: <FiHome size={24} />,
        },
        {
            href: "/test/dependencies/radix-ui",
            label: "Radix UI",
            description: "Тестирование зависимостей Radix UI",
            icon: <FiCrosshair size={24} />,
        },
        {
            href: "/test/dependencies",
            label: "Меню выбора тестирования зависимостей",
            description: "Ты находишься здесь, baka",
            icon: <FiKey size={24} />,
        }
    ];

    return (
        <main className="pt-20 max-w-4xl mx-auto min-h-screen font-sans bg-transparent">
            <div className="absolute top-4 right-4 z-50">
                <Breadcrumbs />
            </div>
            <NavPanel links={links} />
        </main>
    );
}
