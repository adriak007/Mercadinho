import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ success: true });

  const cookiesToDelete = [
    "next-auth.callback-url",
    "next-auth.csrf-token",
    "next-auth.session-token",
    "__Secure-next-auth.session-token",
    "__Host-next-auth.session-token",
    "auth_token",
    "__Secure-next-auth.callback-url",
    "__Host-next-auth.csrf-token",
  ];

  const deletionOptions = {
    path: "/",
    httpOnly: true,
    secure: true,
    expires: new Date(0),
  };

  cookiesToDelete.forEach((name) => {
    res.cookies.set(name, "", deletionOptions);
  });

  return res;
}
