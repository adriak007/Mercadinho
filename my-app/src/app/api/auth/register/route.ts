export const runtime = "nodejs";

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Preencha todos os campos." }, { status: 400 });
    }

    await connectToDatabase();

    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json({ error: "E-mail ja cadastrado." }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashed, role: "user" });

    return NextResponse.json({ message: "Cadastro realizado com sucesso." }, { status: 201 });
  } catch (error) {
    console.error("Erro no registro", error);
    const message =
      process.env.NODE_ENV !== "production" && error instanceof Error
        ? error.message
        : "Erro no servidor ao registrar. Verifique logs.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
