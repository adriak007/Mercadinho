"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import type { ApexOptions } from "apexcharts";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

type DailyPoint = { dia: string; total: number };

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 2,
});

function formatDayLabel(dateISO: string) {
  const date = new Date(dateISO);
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit" }).format(date);
}

function formatDate(dateISO: string) {
  const date = new Date(dateISO);
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

export default function FluxoCaixaDiario() {
  const [data, setData] = useState<DailyPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/dashboard/fluxo-diario", { cache: "no-store" });
        if (!res.ok) throw new Error("Falha ao carregar fluxo diario");
        const payload = (await res.json()) as DailyPoint[];
        setData(payload);
      } catch (err) {
        console.error(err);
        setError("Nao foi possivel carregar o fluxo de caixa.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const totals = data.map((d) => d.total);
  const maxValue = totals.length ? Math.max(...totals) : 0;
  const minValue = totals.length ? Math.min(...totals) : 0;
  const baseSpan = maxValue === minValue ? maxValue || 100 : maxValue - minValue;
  const padding = Math.max(Math.round(baseSpan * 0.4), baseSpan < 500 ? 120 : 0);
  const yMin = Math.max(0, minValue - padding);
  const yMax = maxValue + padding || 1000;
  const average = totals.length ? totals.reduce((sum, value) => sum + value, 0) / totals.length : 0;

  const series = useMemo(
    () => [
      {
        name: "Fluxo de Caixa",
        data: data.map((d) => Number(d.total.toFixed(2))),
      },
    ],
    [data]
  );

  const options = useMemo<ApexOptions>(() => {
    return {
      chart: {
        type: "bar",
        stacked: false,
        toolbar: { show: false },
        foreColor: "#0f172a",
        fontFamily: "Inter, 'Segoe UI', system-ui, -apple-system, sans-serif",
      },
      plotOptions: {
        bar: {
          columnWidth: "55%",
          borderRadius: 0,
          distributed: false,
          dataLabels: {
            position: "top",
          },
        },
      },
      colors: ["#16a34a"],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        width: 2,
        colors: ["#0f172a10"],
      },
      grid: {
        show: false,
        padding: { left: 8, right: 8 },
      },
      xaxis: {
        categories: data.map((d) => formatDayLabel(d.dia)),
        labels: {
          style: { fontWeight: 600 },
        },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: {
        min: yMin,
        max: yMax,
        tickAmount: 4,
        labels: {
          formatter: (value) => currency.format(value),
          style: { fontWeight: 600 },
        },
      },
      fill: {
        type: "gradient",
        gradient: {
          type: "vertical",
          shadeIntensity: 0.3,
          gradientToColors: ["#22c55e"],
          opacityFrom: 0.95,
          opacityTo: 0.75,
          stops: [0, 60, 100],
        },
      },
      tooltip: {
        theme: "dark",
        y: {
          formatter: (value) => currency.format(value),
          title: {
            formatter: () => "Total do dia",
          },
        },
        x: {
          formatter: (_value, opts) => {
            const day = data[opts.dataPointIndex]?.dia;
            return day ? formatDate(day) : "Dia";
          },
        },
      },
      states: {
        hover: { filter: { type: "lighten", value: 0.1 } },
        active: { filter: { type: "darken", value: 0.2 } },
      },
      annotations: average
        ? {
            yaxis: [
              {
                y: average,
                borderColor: "#0ea5e9",
                strokeDashArray: 4,
                label: {
                  text: `Media ${currency.format(average)}`,
                  style: {
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "#0ea5e9",
                    background: "#e0f2fe",
                    borderColor: "#0ea5e9",
                  },
                },
              },
            ],
          }
        : undefined,
    };
  }, [average, data, yMax, yMin]);

  return (
    <div className="w-full rounded-sm border border-slate-200 bg-gradient-to-b from-white to-slate-50 shadow-md p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-xs uppercase tracking-[0.08em] text-slate-500 font-semibold">Visao diaria</p>
          <h3 className="text-xl font-bold text-slate-900">Fluxo de Caixa</h3>
        </div>
        <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-full px-3 py-1 shadow-[0_1px_3px_rgba(16,185,129,0.2)]">
          Atualizado
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
