export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    let userId = session?.user?.id;

    if (!userId) {
      const token = (await cookies()).get("auth_token")?.value;
      if (token && process.env.JWT_SECRET) {
        try {
          const payload = jwt.verify(token, process.env.JWT_SECRET) as { sub?: string };
          userId = payload.sub;
        } catch {
          // ignore
        }
      }
    }

    if (!userId) {
      return NextResponse.json(
        { error: "Nao autenticado" },
        { status: 401 }
      );
    }

    const { logo } = await request.json();

    if (!logo || typeof logo !== "string") {
      return NextResponse.json(
        { error: "Logo invalida" },
        { status: 400 }
      );
    }

    if (logo.length > 6_000_000) {
      return NextResponse.json(
        { error: "Logo muito grande" },
        { status: 413 }
      );
    }

    await connectToDatabase();
    await User.findByIdAndUpdate(userId, { logo });

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
