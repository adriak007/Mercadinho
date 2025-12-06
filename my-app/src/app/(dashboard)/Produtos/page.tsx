"use client";

import { useEffect, useState } from "react";

export default function ProdutosPage() {
  const [produtos, setProdutos] = useState([]);
  const [form, setForm] = useState({ nome: "", preco: "", estoque: "" });

  async function carregar() {
    const res = await fetch("/api/produtos");
    setProdutos(await res.json());
  }

  async function salvar() {
    await fetch("/api/produtos", {
      method: "POST",
      body: JSON.stringify(form),
    });
    setForm({ nome: "", preco: "", estoque: "" });
    carregar();
  }

  async function remover(id: string) {
    await fetch(`/api/produtos/${id}`, { method: "DELETE" });
    carregar();
  }

  useEffect(() => {
    carregar();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Produtos</h1>

      <div className="mb-4 flex gap-3">
        <input
          placeholder="Nome"
          value={form.nome}
          onChange={(e) => setForm({ ...form, nome: e.target.value })}
          className="border px-2 py-1"
        />
        <input
          placeholder="Preço"
          value={form.preco}
          onChange={(e) => setForm({ ...form, preco: e.target.value })}
          className="border px-2 py-1"
        />
        <input
          placeholder="Estoque"
          value={form.estoque}
          onChange={(e) => setForm({ ...form, estoque: e.target.value })}
          className="border px-2 py-1"
        />

        <button
          onClick={salvar}
          className="bg-green-500 text-white px-4 py-1 rounded"
        >
          Salvar
        </button>
      </div>

      <table className="w-full bg-white shadow">
        <thead>
          <tr className="border-b">
            <th className="p-2">Nome</th>
            <th>Preço</th>
            <th>Estoque</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          {produtos.map((p: any) => (
            <tr key={p._id} className="border-b">
              <td className="p-2">{p.nome}</td>
              <td>{p.preco}</td>
              <td>{p.estoque}</td>
              <td>
                <button
                  className="bg-red-600 text-white px-3 py-1 rounded"
                  onClick={() => remover(p._id)}
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
