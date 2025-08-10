"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import styles from "@/styles/components.module.css";

export default function NavPanel({ links }) {
  const pathname = usePathname();
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <aside className="bg-gradient-to-br from-indigo-50 via-white to-indigo-50 rounded-2xl shadow-2xl p-8 max-w-md mx-auto">
      <ul className="space-y-6">
        {links.map(({ href, label, description, icon }, index) => {
          const isActive = pathname === href;
          const isHovered = hoveredIndex === index;

          return (
            <li
              key={href}
              className={`${styles.perspective} relative w-full h-24 cursor-pointer`}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <a
                href={href}
                aria-current={isActive ? "page" : undefined}
                className="block w-full h-full rounded-2xl shadow-inner overflow-hidden"
              >
                <div
                  className={`
                    relative w-full h-full rounded-2xl transition-transform duration-600
                    ${styles.transformStylePreserve3d}
                    ${isHovered ? `${styles.rotateX180} scale-105` : "scale-100"}
                    ${isActive ? "bg-gradient-to-r from-indigo-600 to-indigo-800 shadow-lg shadow-indigo-500/40" : "bg-white"}
                    flex flex-col items-center justify-center px-8 py-4 font-semibold text-center select-none
                    ${isActive ? "text-white" : "text-gray-800"}
                  `}
                >
                  {/* Передняя сторона */}
                  <span
                    className={`${styles.backfaceHidden} absolute inset-0 flex flex-col items-center justify-center px-6 space-y-2`}
                  >
                    <span className="text-indigo-600">
                      {icon || <FiArrowRight size={28} />}
                    </span>
                    {label}
                  </span>

                  {/* Задняя сторона */}
                  <span
                    className={`${styles.backfaceHidden} absolute inset-0 flex flex-col items-center justify-center bg-indigo-600 text-white rounded-2xl text-sm px-6 ${styles.rotateX180}`}
                  >
                    <p className={styles.description}>{description}</p>
                  </span>
                </div>
              </a>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
