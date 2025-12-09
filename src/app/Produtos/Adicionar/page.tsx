"use client";

import { useState } from "react";
import Link from "next/link";
import Shell from "../../components/Shell";

const tabs = [
  "Dados",
  "Detalhes",
  "Valores",
  "Estoque",
  "Fotos",
  "Fiscal",
  "Composicao",
  "Fornecedores",
  "Lojas",
];

export default function AdicionarProdutoPage() {
  const [activeTab, setActiveTab] = useState("Dados");

  return (
    <Shell>
      <main className="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-slate-800">Adicionar produto</h1>
          <div className="text-sm text-slate-500 flex items-center gap-2">
            <span>Inicio</span>
            <span>/</span>
            <Link href="/Produtos" className="text-emerald-600 hover:underline">
              Produtos
            </Link>
            <span>/</span>
            <span>Adicionar</span>
          </div>
        </div>

        <div className="rounded-sm border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-wrap border-b border-slate-200">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-sm font-semibold transition ${
                  activeTab === tab
                    ? "border-b-2 border-emerald-600 text-emerald-700"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="p-6 space-y-6">
            {activeTab === "Dados" && <DadosTab />}
            {activeTab !== "Dados" && (
              <div className="rounded-sm border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
                Conteudo de "{activeTab}" pronto para configurar. Ajuste conforme integracao real.
              </div>
            )}

            <UnitConversion />
          </div>

          <footer className="flex items-center gap-3 border-t border-slate-200 px-6 py-4">
            <button className="inline-flex items-center gap-2 rounded-sm bg-emerald-600 px-4 py-2 text-white font-semibold hover:bg-emerald-700 transition">
              Cadastrar
            </button>
            <Link
              href="/Produtos"
              className="inline-flex items-center gap-2 rounded-sm bg-rose-500 px-4 py-2 text-white font-semibold hover:bg-rose-600 transition"
            >
              Cancelar
            </Link>
            <div className="ml-auto flex items-center gap-2 text-sm text-slate-500">
              <button className="rounded-sm border border-slate-200 px-4 py-2 text-slate-600 hover:bg-slate-50 transition">
                Voltar
              </button>
              <button className="rounded-sm border border-slate-200 px-4 py-2 text-slate-600 hover:bg-slate-50 transition">
                Continuar
              </button>
            </div>
          </footer>
        </div>
      </main>
    </Shell>
  );
}

function DadosTab() {
  return (
    <div className="space-y-4">
      <div className="grid lg:grid-cols-3 gap-4">
        <TextField label="Nome" required />
        <div className="grid grid-cols-[1fr_auto] gap-2">
          <TextField label="Codigo interno" required />
          <button className="rounded-sm border border-slate-200 px-3 text-sm text-slate-700 hover:bg-slate-50 transition">
            Gerar
          </button>
        </div>
        <TextField label="Codigo de barra" />
        <TextField label="Grupo do produto" placeholder="Digite para buscar" />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <SelectField label="Movimenta estoque?" options={["Sim", "Nao"]} />
        <SelectField label="Habilitar nota fiscal?" options={["Sim", "Nao"]} />
        <SelectField label="Possui variacoes?" options={["Nao", "Sim"]} />
        <SelectField label="Possui composicao?" options={["Nao", "Sim"]} />
      </div>
    </div>
  );
}

function UnitConversion() {
  return (
    <div className="rounded-sm border border-slate-200">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-slate-50">
        <h3 className="text-sm font-semibold text-slate-700">Conversao de unidade</h3>
        <span className="text-slate-400 text-lg">⇄</span>
      </div>
      <div className="bg-sky-50 text-sky-800 px-4 py-3 text-sm border-b border-slate-200">
        A conversao de unidades permite que voce compre em uma unidade e venda em outra.
      </div>

      <div className="p-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm font-semibold text-slate-700">Entrada</p>
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-500">1</span>
              <input
                className="flex-1 rounded-sm border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                placeholder="Unidade de entrada"
              />
              <button className="rounded-sm border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition">
                Remover
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold text-slate-700">Saida</p>
            <div className="flex items-center gap-3">
              <input
                className="w-28 rounded-sm border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                placeholder="1,00"
              />
              <input
                className="flex-1 rounded-sm border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                placeholder="Unidade de saida"
              />
              <button className="rounded-sm border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition">
                Remover
              </button>
            </div>
          </div>
        </div>

        <div className="mt-3 flex justify-between text-sm text-slate-500">
          <span>equivale a</span>
          <button className="rounded-sm border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition">
            Adicionar linha
          </button>
        </div>
      </div>
    </div>
  );
}

function TextField({
  label,
  placeholder,
  required,
}: {
  label: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="space-y-1 text-sm text-slate-700">
      <span className="block font-semibold">
        {label} {required ? "*" : ""}
      </span>
      <input
        className="w-full rounded-sm border border-slate-200 px-3 py-2 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
        placeholder={placeholder || "Preencha o campo"}
      />
    </label>
  );
}

function SelectField({
  label,
  options,
}: {
  label: string;
  options: string[];
}) {
  return (
    <label className="space-y-1 text-sm text-slate-700">
      <span className="block font-semibold">{label}</span>
      <select className="w-full rounded-sm border border-slate-200 px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-400">
        {options.map((opt) => (
          <option key={opt}>{opt}</option>
        ))}
      </select>
    </label>
  );
}
