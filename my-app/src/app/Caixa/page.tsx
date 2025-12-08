import Shell from "../components/Shell";

export default function CaixaPage() {
  return (
    <Shell>
      <main className="p-8">
        <div className="bg-white shadow-md rounded-sm p-6">
          <header className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold uppercase tracking-wide">
              Localize um produto/servico abaixo
            </h1>
            <div className="flex items-center gap-2 bg-emerald-600 text-white rounded-sm px-4 py-2 text-xs font-semibold uppercase tracking-wide">
              <div className="text-left">
                <p>Cliente: ao consumidor</p>
                <p>Vendedor: cliente</p>
              </div>
              <span className="text-lg">##</span>
            </div>
          </header>

          <section className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <input
                type="text"
                placeholder="Digite o codigo ou o nome"
                className="w-full rounded-sm border border-amber-300 bg-amber-50 px-4 py-3 text-slate-800 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />

              <div className="grid sm:grid-cols-3 gap-4">
                <div className="rounded-sm border border-slate-200 bg-slate-50 flex items-center justify-center">
                  <div className="text-center text-slate-400 text-sm px-4 py-10">
                    <div className="text-4xl mb-2">IMG</div>
                    <p>Imagem do produto</p>
                  </div>
                </div>

                <div className="sm:col-span-2 space-y-3">
                  <Field label="Codigo" />
                  <Field label="Quantidade" />
                  <Field label="Valor unitario" />
                  <div className="grid grid-cols-[1fr_auto] gap-2">
                    <Field label="Desconto" />
                    <select className="rounded-sm border border-slate-200 bg-white px-3 text-sm text-slate-700">
                      <option>R$</option>
                      <option>%</option>
                    </select>
                  </div>
                  <Field label="Valor total" />
                </div>
              </div>

              <button className="w-full rounded-sm bg-black text-white py-3 text-sm font-semibold tracking-wide uppercase hover:bg-slate-900 transition">
                Adicionar produto
              </button>
            </div>

            <aside className="space-y-4">
              <div className="rounded-sm border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-700 uppercase mb-3">
                  Total do pedido
                </p>
                <div className="rounded-sm bg-slate-900 text-white text-3xl font-bold text-center py-4">
                  --,-- 
                </div>
              </div>

              <div className="space-y-3">
                <ActionButton tone="amber" label="Aguardar" />
                <ActionButton tone="rose" label="Cancelar" />
                <ActionButton tone="emerald" label="Finalizar venda" />
              </div>
            </aside>
          </section>
        </div>
      </main>
    </Shell>
  );
}

function Field({ label }: { label: string }) {
  return (
    <label className="w-full text-sm font-semibold text-slate-600 uppercase tracking-wide space-y-1">
      <span className="block">{label}</span>
      <input
        className="w-full rounded-sm border border-slate-200 bg-white px-4 py-3 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
        placeholder="Preencha o valor"
      />
    </label>
  );
}

function ActionButton({
  label,
  tone,
}: {
  label: string;
  tone: "amber" | "rose" | "emerald";
}) {
  const tones: Record<typeof tone, string> = {
    amber: "bg-amber-500 hover:bg-amber-600",
    rose: "bg-rose-400 hover:bg-rose-500",
    emerald: "bg-emerald-600 hover:bg-emerald-700",
  };

  return (
    <button
      className={`w-full rounded-sm text-white py-3 text-sm font-semibold uppercase tracking-wide transition ${tones[tone]}`}
    >
      {label}
    </button>
  );
}
