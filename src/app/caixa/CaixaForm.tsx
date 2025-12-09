"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import type { ActionState } from "@/types/actions";
import type { SaleItem } from "@/types/products";

type ProductLite = {
  id: string;
  name: string;
  code: string;
  price: number;
  stock: number;
  tracksStock: boolean;
};

type CartItem = ProductLite & { quantity: number; unitPrice: number };

export default function CaixaForm({
  products,
  action,
}: {
  products: ProductLite[];
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
}) {
  const [query, setQuery] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selected, setSelected] = useState<ProductLite | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [state, formAction, pending] = useActionState<ActionState, FormData>(action, { ok: false });

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return products.slice(0, 8);
    return products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.code.toLowerCase().includes(term)
      )
      .slice(0, 8);
  }, [products, query]);

  useEffect(() => {
    if (state.ok) {
      setCart([]);
      setSelected(null);
      setQuery("");
      setQuantity(1);
    }
  }, [state.ok]);

  const total = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  const handleAdd = () => {
    if (!selected) return;
    if (quantity <= 0) return;
    setCart((prev) => {
      const existing = prev.find((i) => i.id === selected.id);
      if (existing) {
        return prev.map((i) =>
          i.id === selected.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...prev, { ...selected, quantity, unitPrice: selected.price }];
    });
    setQuantity(1);
    setSelected(null);
    setQuery("");
  };

  const removeItem = (id: string) => setCart((prev) => prev.filter((i) => i.id !== id));

  const saleItems: SaleItem[] = cart.map((item) => ({
    productId: item.id,
    quantity: item.quantity,
    price: item.unitPrice,
  }));

  return (
    <form action={formAction}>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Digite o codigo ou o nome"
            className="w-full rounded-sm border border-amber-300 bg-amber-50 px-4 py-3 text-slate-800 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#3a8620]"
          />

          {filtered.length > 0 && (
            <div className="rounded-sm border border-slate-200 bg-white shadow-sm divide-y">
              {filtered.map((product) => (
                <button
                  type="button"
                  key={product.id}
                  onClick={() => setSelected(product)}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 flex justify-between text-sm"
                >
                  <div>
                    <p className="font-semibold text-slate-800">{product.name}</p>
                    <p className="text-slate-500">Cod: {product.code}</p>
                  </div>
                  <div className="text-right text-sm text-slate-600">
                    <p>{formatCurrency(product.price)}</p>
                    <p className="text-xs">Estoque: {product.tracksStock ? product.stock : "--"}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="rounded-sm border border-slate-200 bg-slate-50 flex items-center justify-center">
              <div className="text-center text-slate-400 text-sm px-4 py-10">
                <div className="text-4xl mb-2">IMG</div>
                <p>Imagem do produto</p>
              </div>
            </div>

            <div className="sm:col-span-2 space-y-3">
              <Field label="Codigo" value={selected?.code || ""} readOnly />
              <label className="w-full text-sm font-semibold text-slate-600 uppercase tracking-wide space-y-1">
                <span className="block">Quantidade</span>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full rounded-sm border border-slate-200 bg-white px-4 py-3 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3a8620]"
                  placeholder="1"
                />
              </label>
              <Field label="Valor unitario" value={selected ? formatCurrency(selected.price) : "--"} readOnly />
              <Field
                label="Valor total"
                value={selected ? formatCurrency(selected.price * quantity || 0) : "--"}
                readOnly
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            className="w-full rounded-sm bg-black text-white py-3 text-sm font-semibold tracking-wide uppercase hover:bg-slate-900 transition disabled:opacity-60"
            disabled={!selected || quantity <= 0}
          >
            Adicionar produto
          </button>
        </div>

        <aside className="space-y-4">
          <div className="rounded-sm border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-700 uppercase mb-3">Total do pedido</p>
            <div className="rounded-sm bg-slate-900 text-white text-3xl font-bold text-center py-4">
              {formatCurrency(total)}
            </div>
          </div>

          <div className="rounded-sm border border-slate-200 bg-white shadow-sm">
            <div className="px-4 py-3 border-b border-slate-200">
              <p className="text-sm font-semibold text-slate-700 uppercase">Itens</p>
            </div>
            <div className="divide-y">
              {cart.length === 0 && (
                <p className="px-4 py-3 text-sm text-slate-500">Nenhum item adicionado.</p>
              )}
              {cart.map((item) => (
                <div key={item.id} className="px-4 py-3 text-sm flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-800">{item.name}</p>
                    <p className="text-slate-500">
                      {item.quantity} x {formatCurrency(item.unitPrice)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-800">
                      {formatCurrency(item.unitPrice * item.quantity)}
                    </p>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="text-rose-500 text-xs hover:underline"
                    >
                      remover
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <button
              type="button"
              className="w-full rounded-sm text-white py-3 text-sm font-semibold uppercase tracking-wide transition bg-amber-500 hover:bg-amber-600"
            >
              Aguardar
            </button>
            <button
              type="button"
              onClick={() => setCart([])}
              className="w-full rounded-sm text-white py-3 text-sm font-semibold uppercase tracking-wide transition bg-rose-400 hover:bg-rose-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={cart.length === 0 || pending}
              className="w-full rounded-sm text-white py-3 text-sm font-semibold uppercase tracking-wide transition bg-[#3a8620] hover:bg-[#326f1b] disabled:opacity-60"
            >
              {pending ? "Finalizando..." : "Finalizar venda"}
            </button>
          </div>

          {state.message && (
            <div className={`text-sm rounded-sm px-3 py-2 border ${state.ok ? "border-[#b7d9ab] bg-[#e8f2e3] text-[#2f6b19]" : "border-rose-200 bg-rose-50 text-rose-700"}`}>
              {state.message}
            </div>
          )}
        </aside>
      </div>

      <input type="hidden" name="items" value={JSON.stringify(saleItems)} />
    </form>
  );
}

function Field({
  label,
  value,
  readOnly = true,
}: {
  label: string;
  value?: string;
  readOnly?: boolean;
}) {
  return (
    <label className="w-full text-sm font-semibold text-slate-600 uppercase tracking-wide space-y-1">
      <span className="block">{label}</span>
      <input
        value={value || ""}
        readOnly={readOnly}
        className="w-full rounded-sm border border-slate-200 bg-white px-4 py-3 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3a8620]"
        placeholder="Preencha o valor"
      />
    </label>
  );
}

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
