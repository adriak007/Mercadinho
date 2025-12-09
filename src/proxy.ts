import type { NextFetchEvent, NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import jwt from "jsonwebtoken";

const PROTECTED_PATHS = [
  "/dashboard",
  "/produtos",
  "/caixa",
  "/relatorios",
  "/config",
];

export default async function proxy(request: NextRequest, _event: NextFetchEvent) {
  const pathname = request.nextUrl.pathname;
  const isProtected = PROTECTED_PATHS.some((path) => pathname.startsWith(path));

  if (!isProtected) return NextResponse.next();

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (token) return NextResponse.next();

  const authToken = request.cookies.get("auth_token")?.value;
  if (authToken && process.env.JWT_SECRET) {
    try {
      jwt.verify(authToken, process.env.JWT_SECRET);
      return NextResponse.next();
    } catch {}
  }

  const signInUrl = new URL("/", request.url);
  signInUrl.searchParams.set("callbackUrl", pathname);
  return NextResponse.redirect(signInUrl);
}
