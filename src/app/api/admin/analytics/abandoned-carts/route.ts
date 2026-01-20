import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { subHours } from "date-fns";

export async function GET() {
    const unauthorized = await requireAdmin();
    if (unauthorized) return unauthorized;

    try {
        const twentyFourHoursAgo = subHours(new Date(), 24);

        const abandonedCarts = await db.cart.findMany({
            where: {
                updatedAt: {
                    lt: twentyFourHoursAgo,
                },
                user: {
                    orders: {
                        none: {
                            status: "PAID",
                            createdAt: {
                                gte: twentyFourHoursAgo,
                            },
                        },
                    },
                },
            },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
                items: {
                    include: {
                        product: {
                            select: {
                                name: true,
                                price: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                updatedAt: "desc",
            },
        });

        return NextResponse.json(abandonedCarts);
    } catch (error) {
        console.error("Failed to fetch abandoned carts:", error);
        return NextResponse.json(
            { error: "Failed to fetch abandoned carts" },
            { status: 500 }
        );
    }
}
