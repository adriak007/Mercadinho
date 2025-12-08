export const runtime = "nodejs";

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import * as jwt from "jsonwebtoken"; // CORRETO PARA TYPESCRIPT
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(request: Request) {
  if (!JWT_SECRET) {
    return NextResponse.json(
      { error: "JWT_SECRET nao configurado" },
      { status: 500 }
    );
  }

  try {
    // ⬇️ cookies() AGORA É ASSÍNCRONO – TEM QUE TER await
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Nao autenticado" },
        { status: 401 }
      );
    }

    const payload = jwt.verify(token, JWT_SECRET) as { sub: string };
    const { logo } = await request.json();

    if (!logo || typeof logo !== "string") {
      return NextResponse.json(
        { error: "Logo invalida" },
        { status: 400 }
      );
    }

    // limite simples para evitar envio muito grande (base64) ~6MB
    if (logo.length > 6_000_000) {
      return NextResponse.json(
        { error: "Logo muito grande" },
        { status: 413 }
      );
    }

    await connectToDatabase();
    await User.findByIdAndUpdate(payload.sub, { logo });

    return NextResponse.json({
      message: "Logo atualizada",
      logo,
    });

  } catch (error) {
    console.error("Erro ao salvar logo", error);
    return NextResponse.json(
      { error: "Erro ao salvar logo" },
      { status: 500 }
    );
  }
}
