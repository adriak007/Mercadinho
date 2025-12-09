"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import type { ApexOptions } from "apexcharts";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

type MonthlyPoint = { mes: string; total: number };

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 2,
});

function formatMonthLabel(monthKey: string) {
  const [year, month] = monthKey.split("-").map(Number);
  const date = new Date(Date.UTC(year, (month || 1) - 1, 1));
  return new Intl.DateTimeFormat("pt-BR", { month: "short" }).format(date);
}

export default function GraficoVendasMensais() {
  const [data, setData] = useState<MonthlyPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/dashboard/vendas-mensais", { cache: "no-store" });
        if (!res.ok) throw new Error("Falha ao carregar vendas mensais");
        const payload = (await res.json()) as MonthlyPoint[];
        setData(payload);
      } catch (err) {
        console.error(err);
        setError("Nao foi possivel carregar as vendas mensais.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const totals = data.map((d) => d.total);
  const maxValue = totals.length ? Math.max(...totals) : 0;
  const minValue = totals.length ? Math.min(...totals) : 0;
  const span = maxValue === minValue ? maxValue || 100 : maxValue - minValue;
  const padding = Math.max(Math.round(span * 0.3), span < 1000 ? 200 : 0);
  const yMin = Math.max(0, minValue - padding);
  const yMax = maxValue + padding || 1000;
  const average = totals.length ? totals.reduce((sum, value) => sum + value, 0) / totals.length : 0;

  const series = useMemo(
    () => [
      {
        name: "Total vendido",
        data: data.map((d) => Number(d.total.toFixed(2))),
      },
    ],
    [data]
  );

  const options = useMemo<ApexOptions>(() => {
    return {
      chart: {
        type: "bar",
        toolbar: { show: false },
        foreColor: "#0f172a",
        fontFamily: "Inter, 'Segoe UI', system-ui, -apple-system, sans-serif",
      },
      plotOptions: {
        bar: {
          columnWidth: "50%",
          borderRadius: 0,
          dataLabels: { position: "top" },
        },
      },
      colors: ["#2563eb"],
      dataLabels: {
        enabled: false,
      },
      grid: {
        strokeDashArray: 3,
        borderColor: "#e2e8f0",
        padding: { left: 10, right: 10 },
      },
      xaxis: {
        categories: data.map((d) => formatMonthLabel(d.mes)),
        labels: {
          style: { fontWeight: 700 },
        },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: {
        min: yMin,
        max: yMax,
        labels: {
          formatter: (value) => currency.format(value),
        },
      },
      fill: {
        type: "gradient",
        gradient: {
          type: "vertical",
          shadeIntensity: 0.35,
          gradientToColors: ["#1d4ed8"],
          opacityFrom: 0.95,
          opacityTo: 0.75,
          stops: [0, 50, 100],
        },
      },
      tooltip: {
        theme: "dark",
        y: {
          formatter: (value) => currency.format(value),
        },
        x: {
          formatter: (_value, opts) => data[opts.dataPointIndex]?.mes || "Mes",
        },
      },
      annotations: average
        ? {
            yaxis: [
              {
                y: average,
                borderColor: "#64748b",
                strokeDashArray: 4,
                label: {
                  text: `Media ${currency.format(average)}`,
                  style: {
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "#0f172a",
                    background: "#e2e8f0",
                    borderColor: "#cbd5e1",
                  },
                },
              },
            ],
          }
        : undefined,
      states: {
        hover: { filter: { type: "lighten", value: 0.06 } },
        active: { filter: { type: "none" } },
      },
    };
  }, [average, data, yMax, yMin]);

  return (
    <div className="w-full rounded-sm border border-slate-200 bg-white shadow-md p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-xs uppercase tracking-[0.08em] text-slate-500 font-semibold">Ultimos 6 meses</p>
          <h3 className="text-xl font-bold text-slate-900">Total de Vendas</h3>
        </div>
        <span className="text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-100 rounded-full px-3 py-1 shadow-[0_1px_3px_rgba(37,99,235,0.2)]">
          Financeiro
        </span>
      </div>

      {loading && (
        <div className="h-[280px] flex items-center justify-center text-sm text-slate-500">Carregando grafico...</div>
      )}

      {!loading && error && (
        <div className="h-[280px] flex items-center justify-center text-sm text-rose-600">
          {error}
        </div>
      )}

      {!loading && !error && (
        <ReactApexChart options={options} series={series} type="bar" height={320} />
      )}
    </div>
  );
}
