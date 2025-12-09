import Shell from "../components/Shell";

const optionsDecimal = ["2", "3", "4"];
const optionsStock = ["Nao controlar estoque", "Controlar por compra", "Controlar por compra e venda"];
const optionsCost = ["Atualizar valor medio de todas as compras", "Manter ultimo custo", "Calcular custo pelo FIFO"];
const optionsNoStock = ["Permitir vender", "Bloquear venda", "Avisar operador"];
const optionsPayment = ["Nao permitir vender", "Permitir com aviso", "Permitir vender"];
const optionsSupport = ["Sim", "Nao"];

export default function ConfigPage() {
  return (
    <Shell>
      <main className="p-8 space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-800">Configuracoes gerais</h1>
            <p className="text-sm text-slate-500">Ajuste os parametros basicos do sistema.</p>
          </div>
          <span className="text-sm text-slate-500">Inicio / Configuracoes gerais</span>
        </header>

        <section className="rounded-sm border border-slate-200 bg-white shadow-sm p-6">
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 border-b-2 border-[#3a8620] pb-2 text-[#2f6b19] font-semibold">
              Dados gerais
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-4">
            <Select label="Casas decimais valor" options={optionsDecimal} />
            <Select label="Casas decimais quantidade" options={optionsDecimal} />
            <Select label="Limite de registro por pagina" options={["30", "50", "100"]} />

            <Select label="Estoque produto composicao" options={optionsStock} />
            <Select label="Produto sem estoque" options={optionsNoStock} />
            <Select label="Vender sem condicoes de pagamento" options={optionsPayment} />

            <Select label="Valor de custo do produto" options={optionsCost} />
            <Select label="Permitir acesso do suporte" options={optionsSupport} />
          </div>

          <div className="mt-8 flex items-center gap-3">
            <button className="inline-flex items-center gap-2 rounded-sm bg-[#3a8620] px-4 py-2 text-white font-semibold hover:bg-[#326f1b] transition">
              Atualizar
            </button>
            <button className="inline-flex items-center gap-2 rounded-sm bg-rose-500 px-4 py-2 text-white font-semibold hover:bg-rose-600 transition">
              Cancelar
            </button>
          </div>
        </section>
      </main>
    </Shell>
  );
}

function Select({ label, options }: { label: string; options: string[] }) {
  return (
    <label className="space-y-1 text-sm text-slate-700">
      <span className="block font-semibold">{label}</span>
      <select className="w-full rounded-sm border border-slate-200 bg-white px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#3a8620]">
        {options.map((opt) => (
          <option key={opt}>{opt}</option>
        ))}
      </select>
    </label>
  );
}
