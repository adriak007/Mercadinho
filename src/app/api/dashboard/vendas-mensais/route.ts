export const runtime = "nodejs";
export const revalidate = 0;

import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Sale from "@/models/Sale";

type MonthlyTotal = { mes: string; total: number };

function formatMonthKey(year: number, monthIndex: number) {
  const month = `${monthIndex + 1}`.padStart(2, "0");
  return `${year}-${month}`;
}

export async function GET() {
  try {
    await connectToDatabase();

    const now = new Date();
    const currentYear = now.getUTCFullYear();
    const currentMonth = now.getUTCMonth();

    const startRange = new Date(Date.UTC(currentYear, currentMonth - 5, 1, 0, 0, 0, 0));
    const endRange = new Date(Date.UTC(currentYear, currentMonth + 1, 0, 23, 59, 59, 999));

    const monthlyTotals = await Sale.aggregate<MonthlyTotal>([
      {
        $match: {
          createdAt: {
            $gte: startRange,
            $lte: endRange,
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m", date: "$createdAt" },
          },
          total: {
            $sum: {
              $ifNull: ["$valorTotal", { $ifNull: ["$total", 0] }],
            },
          },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          mes: "$_id",
          total: { $round: ["$total", 2] },
        },
      },
    ]);

    const totalsByMonth = new Map<string, number>();
    monthlyTotals.forEach((item) => totalsByMonth.set(item.mes, item.total));

    const normalized: MonthlyTotal[] = [];
    for (let i = 5; i >= 0; i -= 1) {
      const date = new Date(Date.UTC(currentYear, currentMonth - i, 1));
      const key = formatMonthKey(date.getUTCFullYear(), date.getUTCMonth());
      normalized.push({ mes: key, total: totalsByMonth.get(key) ?? 0 });
    }

    return NextResponse.json(normalized);
  } catch (error) {
    console.error("Erro ao carregar vendas mensais", error);
    return NextResponse.json(
      { error: "Erro ao carregar vendas mensais" },
      { status: 500 }
    );
  }
}
