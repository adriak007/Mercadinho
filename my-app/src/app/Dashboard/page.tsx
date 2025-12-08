import type { ReactNode } from "react";
import Shell from "../components/Shell";

export default function DashboardPage() {
  return (
    <Shell>
      <main className="p-8 space-y-8">
        <header className="flex justify-between items-start">
          <div>
            <p className="text-sm text-slate-500">Bem-vindo(a)</p>
            <h1 className="text-3xl font-bold">Dashboard</h1>
          </div>
          <span className="text-sm text-slate-500">Inicio</span>
        </header>

        <section className="grid xl:grid-cols-3 sm:grid-cols-2 gap-4">
          <SummaryCard title="A receber hoje" action="Conectar contas a receber" />
          <SummaryCard title="A pagar hoje" action="Conectar contas a pagar" tone="alert" />
          <div className="grid grid-cols-2 gap-4 xl:col-span-1 sm:col-span-2">
            <InfoCard title="Recebimentos do mes" />
            <InfoCard title="Pagamentos do mes" />
          </div>
        </section>

        <section className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <SectionHeader title="Fluxo de caixa" />
            <Placeholder height="h-64" message="Sem dados. Conecte seu financeiro." />
          </Card>

          <Card>
            <SectionHeader title="Grafico de vendas" />
            <Placeholder height="h-64" message="Sem dados. Importe ou cadastre vendas." />
          </Card>
        </section>

        <section className="grid lg:grid-cols-3 gap-6">
          <Card>
            <SectionHeader title="Contas bancarias" />
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <PlaceholderLine label="Conta principal" />
              <PlaceholderLine label="Conta secundaria" />
              <PlaceholderLine label="Conta caixa" />
            </div>
          </Card>

          <Card className="lg:col-span-2">
            <SectionHeader title="Calendario" />
            <Placeholder height="h-64" message="Mostraremos seus compromissos aqui." />
          </Card>
        </section>
      </main>
    </Shell>
  );
}

function SummaryCard({
  title,
  action,
  tone = "ok",
}: {
  title: string;
  action: string;
  tone?: "ok" | "alert";
}) {
  const toneClasses =
    tone === "ok"
      ? "bg-emerald-600 text-white"
      : "bg-rose-500 text-white";

  return (
    <div className={`rounded-sm shadow-sm p-5 ${toneClasses} relative overflow-hidden`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold opacity-90">{title}</p>
          <p className="text-2xl font-bold mt-2">Conecte um fluxo</p>
        </div>
      </div>
      <button className="mt-6 inline-flex items-center gap-2 text-sm font-semibold underline underline-offset-4">
        {action}
      </button>
    </div>
  );
}

function InfoCard({ title }: { title: string }) {
  return (
    <div className="rounded-sm border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-sm font-semibold text-slate-600">{title}</p>
      <p className="text-sm text-slate-500 mt-2 leading-relaxed">
        Sem valores ainda. Ative integrações para acompanhar o progresso.
      </p>
      <div className="mt-3 h-2 rounded-sm bg-slate-100 overflow-hidden">
        <div className="h-full w-1/3 bg-slate-300" />
      </div>
    </div>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-semibold text-slate-800">{title}</h2>
      <button className="p-2 rounded-sm hover:bg-slate-100 text-slate-400" aria-label="Configurar secao">
        ...
      </button>
    </div>
  );
}

function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-sm border border-slate-200 bg-white p-5 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

function Placeholder({ height, message }: { height: string; message: string }) {
  return (
    <div
      className={`mt-4 w-full rounded-sm border-2 border-dashed border-slate-200 bg-slate-50 text-slate-500 flex items-center justify-center text-sm ${height}`}
    >
      {message}
    </div>
  );
}

function PlaceholderLine({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-between rounded-sm border border-slate-200 bg-slate-50 px-4 py-3">
      <span>{label}</span>
      <span className="text-slate-400">--</span>
    </div>
  );
}
