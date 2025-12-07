"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input, Button, Card, CardBody } from "@nextui-org/react";

export default function RegisterPage() {
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    setErro("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, senha }),
      });

      if (!res.ok) {
        setErro("Erro ao registrar. Tente outro email.");
        setLoading(false);
        return;
      }

      router.push("/login"); // volta para o login
    } catch {
      setErro("Falha na conexão.");
    }

    setLoading(false);
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="max-w-md w-full shadow-lg">
        <CardBody className="p-6 space-y-6">
          <h1 className="text-2xl font-bold text-center">Criar Conta</h1>

          <Input
            label="Nome"
            size="lg"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />

          <Input
            label="Email"
            size="lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            label="Senha"
            type="password"
            size="lg"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />

          {erro && <p className="text-red-600 text-center text-sm">{erro}</p>}

          <Button
            color="primary"
            fullWidth
            size="lg"
            isLoading={loading}
            onClick={handleRegister}
          >
            Registrar
          </Button>

          <Button
            variant="light"
            fullWidth
            size="lg"
            onClick={() => router.push("/login")}
          >
            Voltar ao Login
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}
