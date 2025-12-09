export const runtime = "nodejs";
export const revalidate = 0;

import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Sale from "@/models/Sale";

type DailyTotal = { dia: string; total: number };

function formatDayKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

export async function GET() {
  try {
    await connectToDatabase();

    const today = new Date();
    const year = today.getUTCFullYear();
    const month = today.getUTCMonth();

    const startOfMonth = new Date(Date.UTC(year, month, 1, 0, 0, 0, 0));
    const endOfMonth = new Date(Date.UTC(year, month + 1, 0, 23, 59, 59, 999));

    const dailyTotals = await Sale.aggregate<DailyTotal>([
      {
        $match: {
          createdAt: {
            $gte: startOfMonth,
            $lte: endOfMonth,
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
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
          dia: "$_id",
          total: { $round: ["$total", 2] },
        },
      },
    ]);

    const totalsByDay = new Map<string, number>();
    dailyTotals.forEach((item) => totalsByDay.set(item.dia, item.total));

    const daysInMonth = new Date(year, month + 1, 0).getUTCDate();
    const normalized: DailyTotal[] = Array.from({ length: daysInMonth }, (_, idx) => {
      const dayDate = new Date(Date.UTC(year, month, idx + 1));
      const key = formatDayKey(dayDate);
      return { dia: key, total: totalsByDay.get(key) ?? 0 };
    });

    return NextResponse.json(normalized);
  } catch (error) {
    console.error("Erro ao carregar fluxo diario", error);
    return NextResponse.json(
      { error: "Erro ao carregar fluxo diario" },
      { status: 500 }
    );
  }
}
