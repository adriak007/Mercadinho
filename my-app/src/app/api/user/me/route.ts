export const runtime = "nodejs";

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import * as jwt from "jsonwebtoken";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET() {
  if (!JWT_SECRET) {
    return NextResponse.json(
      { error: "JWT_SECRET nao configurado" },
      { status: 500 }
    );
  }

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token)
      return NextResponse.json({ error: "Nao autenticado" }, { status: 401 });

    const payload = jwt.verify(token, JWT_SECRET) as { sub: string };

    await connectToDatabase();
    const user = await User.findById(payload.sub).select(
      "name email role logo"
    );

    if (!user)
      return NextResponse.json(
        { error: "Usuario nao encontrado" },
        { status: 404 }
      );

    return NextResponse.json({
      name: user.name,
      email: user.email,
      role: user.role,
      logo: user.logo,
    });
  } catch (error) {
    console.error("Erro ao buscar usuario", error);
    return NextResponse.json(
      { error: "Erro ao buscar usuario" },
      { status: 500 }
    );
  }
}
