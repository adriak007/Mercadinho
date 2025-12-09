"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ActionState } from "@/types/actions";

type ProductFormProps = {
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
  initialData?: Partial<ProductFormData>;
  mode: "create" | "edit";
};

type ProductFormData = {
  id?: string;
  name: string;
  code: string;
  barcode?: string;
  category?: string;
  unit?: string;
  price: number;
  cost?: number;
  stock?: number;
  notes?: string;
  tracksStock?: boolean;
  allowInvoice?: boolean;
  hasVariations?: boolean;
  hasComposition?: boolean;
};

const tabs = ["Dados", "Detalhes", "Valores", "Estoque"];

export default function ProductForm({ action, initialData, mode }: ProductFormProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Dados");
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(action, {
    ok: false,
  });

  const defaultValues: Required<ProductFormData> = useMemo(
    () => ({
      id: initialData?.id || "",
      name: initialData?.name || "",
      code: initialData?.code || "",
      barcode: initialData?.barcode || "",
      category: initialData?.category || "",
      unit: initialData?.unit || "un",
      price: initialData?.price ?? 0,
      cost: initialData?.cost ?? 0,
      stock: initialData?.stock ?? 0,
      notes: initialData?.notes || "",
      tracksStock: initialData?.tracksStock ?? true,
      allowInvoice: initialData?.allowInvoice ?? false,
      hasVariations: initialData?.hasVariations ?? false,
      hasComposition: initialData?.hasComposition ?? false,
    }),
    [initialData]
  );

  useEffect(() => {
    if (state.ok) {
      router.push("/produtos");
      router.refresh();
    }
  }, [state.ok, router]);

  return (
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
            type="button"
          >
            {tab}
          </button>
        ))}
      </div>

      <form action={formAction}>
        {defaultValues.id && <input type="hidden" name="id" value={defaultValues.id} />}

        <div className="p-6 space-y-6">
          <div className={activeTab === "Dados" ? "block" : "hidden"}>
            <DadosTab defaults={defaultValues} />
          </div>
          <div className={activeTab === "Detalhes" ? "block" : "hidden"}>
            <DetalhesTab defaults={defaultValues} />
          </div>
          <div className={activeTab === "Valores" ? "block" : "hidden"}>
            <ValoresTab defaults={defaultValues} />
          </div>
          <div className={activeTab === "Estoque" ? "block" : "hidden"}>
            <EstoqueTab defaults={defaultValues} />
          </div>
        </div>

        {state.message && (
          <div className={`mx-6 mb-4 rounded-sm border px-3 py-2 text-sm ${state.ok ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-rose-200 bg-rose-50 text-rose-700"}`}>
            {state.message}
          </div>
        )}

        <footer className="flex items-center gap-3 border-t border-slate-200 px-6 py-4">
          <button
            className="inline-flex items-center gap-2 rounded-sm bg-emerald-600 px-4 py-2 text-white font-semibold hover:bg-emerald-700 transition disabled:opacity-60"
            type="submit"
            disabled={isPending}
          >
            {mode === "create" ? "Cadastrar" : "Salvar"}
          </button>
          <Link
            href="/produtos"
            className="inline-flex items-center gap-2 rounded-sm bg-rose-500 px-4 py-2 text-white font-semibold hover:bg-rose-600 transition"
          >
            Cancelar
          </Link>
          <div className="ml-auto flex items-center gap-2 text-sm text-slate-500">
            {isPending ? "Salvando..." : "Pronto para enviar"}
          </div>
        </footer>
      </form>
    </div>
  );
}

function DadosTab({ defaults }: { defaults: Required<ProductFormData> }) {
  return (
    <div className="space-y-4">
      <div className="grid lg:grid-cols-3 gap-4">
        <TextField label="Nome" name="name" required defaultValue={defaults.name} />
        <div className="grid grid-cols-[1fr_auto] gap-2">
          <TextField label="Codigo interno" name="code" required defaultValue={defaults.code} />
          <button
            className="rounded-sm border border-slate-200 px-3 text-sm text-slate-700 hover:bg-slate-50 transition"
            type="button"
            title="Gere o codigo como preferir"
          >
            Gerar
          </button>
        </div>
        <TextField label="Codigo de barra" name="barcode" defaultValue={defaults.barcode} />
        <TextField label="Grupo do produto" name="category" placeholder="Digite para buscar" defaultValue={defaults.category} />
        <TextField label="Unidade" name="unit" defaultValue={defaults.unit} />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <CheckboxField name="allowInvoice" label="Habilitar nota fiscal?" defaultChecked={defaults.allowInvoice} />
        <CheckboxField name="hasVariations" label="Possui variacoes?" defaultChecked={defaults.hasVariations} />
        <CheckboxField name="hasComposition" label="Possui composicao?" defaultChecked={defaults.hasComposition} />
      </div>
    </div>
  );
}

function DetalhesTab({ defaults }: { defaults: Required<ProductFormData> }) {
  return (
    <div className="space-y-3">
      <label className="space-y-2 text-sm text-slate-700">
        <span className="block font-semibold">Observacoes</span>
        <textarea
          name="notes"
          defaultValue={defaults.notes}
          className="w-full rounded-sm border border-slate-200 px-3 py-2 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 h-28 resize-none"
          placeholder="Detalhes adicionais sobre o produto"
        />
      </label>
    </div>
  );
}

function ValoresTab({ defaults }: { defaults: Required<ProductFormData> }) {
  return (
    <div className="grid lg:grid-cols-3 gap-4">
      <NumberField label="Custo" name="cost" step="0.01" defaultValue={defaults.cost} />
      <NumberField label="Valor de venda" name="price" step="0.01" required defaultValue={defaults.price} />
    </div>
  );
}

function EstoqueTab({ defaults }: { defaults: Required<ProductFormData> }) {
  return (
    <div className="grid lg:grid-cols-3 gap-4">
      <NumberField
        label="Estoque inicial"
        name="stock"
        step="1"
        min="0"
        defaultValue={defaults.stock}
        placeholder="0"
      />
      <CheckboxField
        name="tracksStock"
        label="Controlar estoque automaticamente"
        defaultChecked={defaults.tracksStock}
      />
    </div>
  );
}

function TextField({
  label,
  name,
  placeholder,
  defaultValue,
  required,
}: {
  label: string;
  name: string;
  placeholder?: string;
  defaultValue?: string;
  required?: boolean;
}) {
  return (
    <label className="space-y-1 text-sm text-slate-700">
      <span className="block font-semibold">
        {label} {required ? "*" : ""}
      </span>
      <input
        name={name}
        defaultValue={defaultValue}
        className="w-full rounded-sm border border-slate-200 px-3 py-2 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
        placeholder={placeholder || "Preencha o campo"}
        required={required}
      />
    </label>
  );
}

function NumberField({
  label,
  name,
  defaultValue,
  step,
  min,
  required,
  placeholder,
}: {
  label: string;
  name: string;
  defaultValue?: number;
  step?: string;
  min?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="space-y-1 text-sm text-slate-700">
      <span className="block font-semibold">
        {label} {required ? "*" : ""}
      </span>
      <input
        type="number"
        name={name}
        defaultValue={defaultValue}
        step={step}
        min={min}
        placeholder={placeholder || "0,00"}
        className="w-full rounded-sm border border-slate-200 px-3 py-2 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
        required={required}
      />
    </label>
  );
}

function CheckboxField({
  name,
  label,
  defaultChecked,
}: {
  name: string;
  label: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
      />
      {label}
    </label>
  );
}
