import { NextResponse } from "next/server";
import { conectaDB } from "../../connect/mongoose";
import Users from "../../models/users";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    await conectaDB();

    const { nome, email, senha } = await req.json();

    if (!nome || !email || !senha) {
      return NextResponse.json(
        { erro: "Dados incompletos." },
        { status: 400 }
      );
    }

    // Verificar se o usuário já existe
    const userExistente = await Users.findOne({ email });
    if (userExistente) {
      return NextResponse.json(
        { erro: "Email já cadastrado." },
        { status: 400 }
      );
    }

    // Criptografar a senha
    const senhaHash = await bcrypt.hash(senha, 10);

    // Criar usuário
    await Users.create({
      nome,
      email,
      password: senhaHash,
    });

    return NextResponse.json({ message: "Usuário criado com sucesso!" }, { status: 201 });

  } catch (error) {
    console.error("Erro no registro:", error);
    return NextResponse.json(
      { erro: "Erro interno no servidor." },
      { status: 500 }
    );
  }
}
