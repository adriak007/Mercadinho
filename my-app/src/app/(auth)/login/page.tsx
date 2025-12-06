"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Input, Button, Card, CardBody } from "@nextui-org/react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setErro("");
    setLoading(true);

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password: senha,
    });

    if (res?.error) {
      setErro("Email ou senha incorretos.");
      setLoading(false);
      return;
    }

    router.push("/Dashboard");
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="max-w-md w-full shadow-lg">
        <CardBody className="p-6 space-y-6">
          <h1 className="text-2xl font-bold text-center">Login</h1>

          <Input
            label="Email"
            value={email}
            size="lg"
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            label="Senha"
            type="password"
            value={senha}
            size="lg"
            onChange={(e) => setSenha(e.target.value)}
          />

          {erro && <p className="text-red-600 text-sm text-center">{erro}</p>}

          <Button
            color="primary"
            fullWidth
            size="lg"
            isLoading={loading}
            onClick={handleLogin}
          >
            Entrar
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}
