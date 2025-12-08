export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const sessionUser = session?.user as { id?: string } | undefined;
    const userId = sessionUser?.id;

    if (!userId) {
      return NextResponse.json({ error: "Nao autenticado" }, { status: 401 });
    }

    await connectToDatabase();
    const user = await User.findById(userId).select("name email role logo");

    if (!user) {
      return NextResponse.json(
        { error: "Usuario nao encontrado" },
        { status: 404 }
      );
    }

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
