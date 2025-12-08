/* eslint-disable jsx-a11y/label-has-associated-control */
"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import Shell from "../components/Shell";

type Filters = {
  store: string;
  channel: string;
  seller: string;
  costCenter: string;
  type: string;
  status: string;
  saleDateFrom: string;
  saleDateTo: string;
  deliveryDateFrom: string;
  deliveryDateTo: string;
  client: string;
  product: string;
  service: string;
  payment: string;
  carrier: string;
  detailed: boolean;
  returns: boolean;
  showChannel: boolean;
};

const initialFilters: Filters = {
  store: "Todos",
  channel: "Todos",
  seller: "Todos",
  costCenter: "Todos",
  type: "Todos",
  status: "Todos",
  saleDateFrom: "",
  saleDateTo: "",
  deliveryDateFrom: "",
  deliveryDateTo: "",
  client: "",
  product: "",
  service: "",
  payment: "Todos",
  carrier: "",
  detailed: false,
  returns: false,
  showChannel: false,
};

const selectOptions = {
  store: ["Todos", "Matriz", "Filial 01", "Filial 02"],
  channel: ["Todos", "Loja fisica", "Delivery", "Ecommerce"],
  seller: ["Todos", "Equipe 1", "Equipe 2"],
  costCenter: ["Todos", "Alimentos", "Bebidas", "Limpeza"],
  type: ["Todos", "Venda", "Devolucao", "Cancelado"],
  status: ["Todos", "Pendente", "Concluido"],
  payment: ["Todos", "Dinheiro", "Credito", "Debito", "Pix", "Boleto"],
};

export default function RelatoriosPage() {
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [submitted, setSubmitted] = useState<Filters | null>(null);

const onChange = (
  e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
) => {
  const target = e.target;

  const { name, value, type } = target;

  // Se for checkbox, precisamos garantir que o target é um HTMLInputElement
  const finalValue =
    type === "checkbox"
      ? (target as HTMLInputElement).checked
      : value;

  setFilters((prev) => ({
    ...prev,
    [name]: finalValue,
  }));
};

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(filters);
  };

  const onClear = () => {
    setFilters(initialFilters);
    setSubmitted(null);
  };

  return (
    <Shell>
      <main className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-sm border border-slate-200 bg-slate-50 flex items-center justify-center text-sm font-semibold text-slate-700">
              RV
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-slate-800">
                Relatorio de vendas
              </h1>
              <p className="text-sm text-slate-500">Configure os filtros e gere o relatorio.</p>
            </div>
          </div>
          <span className="text-sm text-slate-500">Inicio / Relatorios</span>
        </div>

        <div className="rounded-sm border border-slate-200 bg-white shadow-sm">
          <form onSubmit={onSubmit} className="p-6 space-y-4">
            <div className="grid xl:grid-cols-3 sm:grid-cols-2 gap-4">
              <SelectField
                label="Loja"
                name="store"
                value={filters.store}
                options={selectOptions.store}
                onChange={onChange}
              />
              <SelectField
                label="Tipo"
                name="type"
                value={filters.type}
                options={selectOptions.type}
                onChange={onChange}
              />
              <DateRange
                label="Data da venda"
                fromName="saleDateFrom"
                toName="saleDateTo"
                fromValue={filters.saleDateFrom}
                toValue={filters.saleDateTo}
                onChange={onChange}
              />

              <DateRange
                label="Data de entrega"
                fromName="deliveryDateFrom"
                toName="deliveryDateTo"
                fromValue={filters.deliveryDateFrom}
                toValue={filters.deliveryDateTo}
                onChange={onChange}
              />
              <SelectField
                label="Canal"
                name="channel"
                value={filters.channel}
                options={selectOptions.channel}
                onChange={onChange}
              />
              <TextField
                label="Cliente"
                name="client"
                value={filters.client}
                placeholder="Digite para buscar"
                onChange={onChange}
              />

              <SelectField
                label="Vendedor"
                name="seller"
                value={filters.seller}
                options={selectOptions.seller}
                onChange={onChange}
              />
              <SelectField
                label="Situacao"
                name="status"
                value={filters.status}
                options={selectOptions.status}
                onChange={onChange}
              />
              <TextField
                label="Produto"
                name="product"
                value={filters.product}
                placeholder="Digite para buscar"
                onChange={onChange}
              />

              <SelectField
                label="Centro de custo"
                name="costCenter"
                value={filters.costCenter}
                options={selectOptions.costCenter}
                onChange={onChange}
              />
              <SelectField
                label="Forma de pagamento"
                name="payment"
                value={filters.payment}
                options={selectOptions.payment}
                onChange={onChange}
              />
              <TextField
                label="Servico"
                name="service"
                value={filters.service}
                placeholder="Digite para buscar"
                onChange={onChange}
              />

              <TextField
                label="Transportadora"
                name="carrier"
                value={filters.carrier}
                placeholder="Digite para buscar"
                onChange={onChange}
              />
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2 text-sm text-slate-700">
              <CheckboxField
                label="Exibir relatorio detalhado"
                name="detailed"
                checked={filters.detailed}
                onChange={onChange}
              />
              <CheckboxField
                label="Considerar devolucoes"
                name="returns"
                checked={filters.returns}
                onChange={onChange}
              />
              <CheckboxField
                label="Exibir canal de venda"
                name="showChannel"
                checked={filters.showChannel}
                onChange={onChange}
              />
            </div>

            <div className="flex items-center gap-3 pt-4">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-sm bg-emerald-600 px-4 py-2 text-white font-semibold hover:bg-emerald-700 transition"
              >
                Gerar
              </button>
              <button
                type="button"
                onClick={onClear}
                className="inline-flex items-center gap-2 rounded-sm bg-rose-500 px-4 py-2 text-white font-semibold hover:bg-rose-600 transition"
              >
                Limpar
              </button>
            </div>
          </form>

          <div className="border-t border-slate-200 p-6">
            {submitted ? (
              <div className="space-y-3">
                <p className="text-sm text-slate-600">Filtros aplicados:</p>
                <div className="grid md:grid-cols-2 gap-3 text-sm text-slate-700">
                  {Object.entries(submitted).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex justify-between rounded-sm border border-slate-100 bg-slate-50 px-3 py-2"
                    >
                      <span className="font-semibold capitalize">{key}</span>
                      <span>{String(value) || "--"}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-500">
                Nenhum filtro aplicado. Preencha os campos e clique em Gerar.
              </p>
            )}
          </div>
        </div>
      </main>
    </Shell>
  );
}

function SelectField({
  label,
  name,
  value,
  options,
  onChange,
}: {
  label: string;
  name: keyof Filters;
  value: string;
  options: string[];
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}) {
  return (
    <label className="space-y-1 text-sm text-slate-700">
      <span className="block font-semibold">{label}</span>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-sm border border-slate-200 bg-white px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-400"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </label>
  );
}

function TextField({
  label,
  name,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  name: keyof Filters;
  value: string;
  placeholder?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <label className="space-y-1 text-sm text-slate-700">
      <span className="block font-semibold">{label}</span>
      <input
        type="text"
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        className="w-full rounded-sm border border-slate-200 bg-white px-3 py-2 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
      />
    </label>
  );
}

function DateRange({
  label,
  fromName,
  toName,
  fromValue,
  toValue,
  onChange,
}: {
  label: string;
  fromName: keyof Filters;
  toName: keyof Filters;
  fromValue: string;
  toValue: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="space-y-1 text-sm text-slate-700">
      <span className="block font-semibold">{label}</span>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
        <input
          type="date"
          name={fromName}
          value={fromValue}
          onChange={onChange}
          className="rounded-sm border border-slate-200 bg-white px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-400"
        />
        <span className="text-center text-slate-400">a</span>
        <input
          type="date"
          name={toName}
          value={toValue}
          onChange={onChange}
          className="rounded-sm border border-slate-200 bg-white px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-400"
        />
      </div>
    </div>
  );
}

function CheckboxField({
  label,
  name,
  checked,
  onChange,
}: {
  label: string;
  name: keyof Filters;
  checked: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <label className="inline-flex items-center gap-2 text-sm text-slate-700">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 rounded-sm border-slate-300 text-emerald-600 focus:ring-emerald-400"
      />
      <span>{label}</span>
    </label>
  );
}
