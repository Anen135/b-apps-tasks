"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Breadcrumbs() {
  const pathname = usePathname(); // например: "/tests/api/extra"

  if (!pathname) return null;

  // Убираем первый пустой элемент (так как split("/"...) даст ["", "tests", "api"])
  const pathSegments = pathname.split("/").filter(Boolean);

  return (
    <nav style={{ padding: "8px 0" }}>
      {pathSegments.map((segment, index) => {
        const href = "/" + pathSegments.slice(0, index + 1).join("/");
        const label = decodeURIComponent(segment);

        const isLast = index === pathSegments.length - 1;

        return (
          <span key={href}>
            {isLast ?
              <span style={{ fontWeight: "bold" }}>{label}</span>
              :
              <Link href={href} style={{ color: "blue", textDecoration: "underline" }}>
                {label}
              </Link>}
            {index < pathSegments.length - 1 && " / "}
          </span>
        );
      })}
    </nav>
  );
}
