import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import Shell from "../components/Shell";

const JWT_SECRET = process.env.JWT_SECRET;

export default function AdminPage() {
  if (!JWT_SECRET) {
    throw new Error("Configure JWT_SECRET no ambiente");
  }

  const token = cookies().get("auth_token")?.value;
  if (!token) redirect("/");

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { role?: string };
    if (payload.role !== "admin") {
      redirect("/");
    }
  } catch (err) {
    redirect("/");
  }

  return (
    <Shell>
      <main className="p-8 space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">Area restrita</p>
            <h1 className="text-2xl font-semibold text-slate-800">Admin</h1>
          </div>
          <span className="text-sm text-slate-500">Inicio / Admin</span>
        </header>

        <section className="grid md:grid-cols-3 gap-4">
          <Card title="Usuarios" value="--" />
          <Card title="Produtos" value="--" />
          <Card title="Vendas" value="--" />
        </section>

        <div className="rounded-sm border border-slate-200 bg-white shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-3">Tarefas rapidas</h2>
          <ul className="list-disc list-inside text-slate-700 text-sm space-y-2">
            <li>Revisar cadastros de usuarios</li>
            <li>Auditar estoque e precos</li>
            <li>Exportar relatorios de vendas</li>
          </ul>
        </div>
      </main>
    </Shell>
  );
}

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-sm border border-slate-200 bg-white shadow-sm p-4">
      <p className="text-sm text-slate-500">{title}</p>
      <p className="text-2xl font-semibold text-slate-800 mt-2">{value}</p>
    </div>
  );
}
