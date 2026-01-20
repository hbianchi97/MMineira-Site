import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { subDays } from "date-fns";

export async function GET(request: Request) {
    const unauthorized = await requireAdmin();
    if (unauthorized) return unauthorized;

    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "30d";

    let days = 30;
    if (period === "7d") days = 7;
    if (period === "90d") days = 90;

    const startDate = subDays(new Date(), days);

    try {
        const sales = await db.order.findMany({
            where: {
                status: "PAID",
                createdAt: {
                    gte: startDate,
                },
            },
            select: {
                createdAt: true,
                total: true,
            },
            orderBy: {
                createdAt: "asc",
            },
        });

        const salesByDay = sales.reduce((acc, sale) => {
            const date = sale.createdAt.toISOString().split("T")[0];
            if (!acc[date]) {
                acc[date] = 0;
            }
            acc[date] += sale.total;
            return acc;
        }, {} as Record<string, number>);

        const formattedSales = Object.keys(salesByDay).map(date => ({
            date,
            total: salesByDay[date] / 100, // Convert from cents
        }));

        return NextResponse.json(formattedSales);
    } catch (error) {
        console.error("Failed to fetch sales data:", error);
        return NextResponse.json(
            { error: "Failed to fetch sales data" },
            { status: 500 }
        );
    }
}
