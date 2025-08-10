// src/middleware.js
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // Разрешаем доступ к страницам логина и авторизации
  if (["/login", "/api/auth"].some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Получаем токен
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Если нет токена → редирект на логин или 401 для API
  if (!token?.login) {
    return pathname.startsWith("/api")
      ? new NextResponse(
          JSON.stringify({ error: "Unauthorized" }),
          { status: 401, headers: { "Content-Type": "application/json" } }
        )
      : NextResponse.redirect(new URL("/login", req.url));
  }

  // 🔹 Проверка прав для /admin
  if (pathname.startsWith("/admin")) {
    const tags = token.tags || [];
    if (!tags.includes("admin")) {
      // Если API → 403
      if (pathname.startsWith("/api")) {
        return new NextResponse(
          JSON.stringify({ error: "Forbidden" }),
          { status: 403, headers: { "Content-Type": "application/json" } }
        );
      }
      // Если страница → редирект на permission-denied
      return NextResponse.redirect(new URL("/permission-denied", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"], // всё кроме статики
};
