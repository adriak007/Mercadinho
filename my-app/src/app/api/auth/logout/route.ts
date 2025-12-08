import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ success: true });

  const cookiesToDelete = [
    "next-auth.callback-url",
    "next-auth.csrf-token",
    "next-auth.session-token",
    "__Secure-next-auth.session-token",
    "__Host-next-auth.session-token"
  ];

  cookiesToDelete.forEach((name) => {
    res.cookies.set({
      name,
      value: "",
      path: "/",
      maxAge: 0,
    });
  });

  return res;
}
