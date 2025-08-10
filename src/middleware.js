// src/middleware.js
// sourcery skip: use-braces
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  if (["/login", "/auth"].some((path) => pathname.startsWith(path))) return NextResponse.next();

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  return !token?.login
    ? pathname.startsWith("/api")
        ? new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } })
        : NextResponse.redirect(new URL("/login", req.url))
    : NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"], // всё кроме статики
};
