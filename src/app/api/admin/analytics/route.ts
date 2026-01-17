import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
    const authError = await requireAdmin();
    if (authError) return authError;

    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get("type") || "sales";
        const startDate = searchParams.get("startDate");
        const endDate = searchParams.get("endDate");
        const page = parseInt(searchParams.get("page") || "1");
        const pageSize = parseInt(searchParams.get("pageSize") || "10");

        const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const end = endDate ? new Date(endDate) : new Date();
        end.setHours(23, 59, 59, 999);

        const skip = (page - 1) * pageSize;

        if (type === "views") {
            const allViews = await db.productView.groupBy({
                by: ["productId"],
                where: {
                    viewedAt: {
                        gte: start,
                        lte: end,
                    },
                },
                _count: {
                    productId: true,
                },
            });

            const total = allViews.length;

            const views = await db.productView.groupBy({
                by: ["productId"],
                where: {
                    viewedAt: {
                        gte: start,
                        lte: end,
                    },
                },
                _count: {
                    productId: true,
                },
                orderBy: {
                    _count: {
                        productId: "desc",
                    },
                },
                skip,
                take: pageSize,
            });

            const productIds = views.map((v) => v.productId);
            const products = await db.product.findMany({
                where: { id: { in: productIds } },
                select: { id: true, name: true, images: true },
            });

            const productsMap = new Map(products.map((p) => [p.id, p]));

            const data = views.map((v) => {
                const product = productsMap.get(v.productId) as { id: string; name: string; images: string[] } | undefined;
                const images = product?.images;
                return {
                    productId: v.productId,
                    name: product?.name || "Produto removido",
                    image: images?.[0] || null,
                    count: v._count.productId,
                };
            });

            return NextResponse.json({ 
                type: "views", 
                data, 
                period: { start, end },
                pagination: {
                    page,
                    pageSize,
                    total,
                    totalPages: Math.ceil(total / pageSize),
                }
            });
        }

        const allOrderItems = await db.orderItem.groupBy({
            by: ["productId"],
            where: {
                order: {
                    createdAt: {
                        gte: start,
                        lte: end,
                    },
                    status: { in: ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"] },
                },
            },
            _count: {
                productId: true,
            },
        });

        const total = allOrderItems.length;

        const orderItems = await db.orderItem.groupBy({
            by: ["productId"],
            where: {
                order: {
                    createdAt: {
                        gte: start,
                        lte: end,
                    },
                    status: { in: ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"] },
                },
            },
            _sum: {
                quantity: true,
            },
            _count: {
                productId: true,
            },
            orderBy: {
                _sum: {
                    quantity: "desc",
                },
            },
            skip,
            take: pageSize,
        });

        const productIds = orderItems.map((o) => o.productId);
        const products = await db.product.findMany({
            where: { id: { in: productIds } },
            select: { id: true, name: true, images: true },
        });

        const productsMap = new Map(products.map((p) => [p.id, p]));

        const data = orderItems.map((o) => {
            const product = productsMap.get(o.productId) as { id: string; name: string; images: string[] } | undefined;
            const images = product?.images;
            return {
                productId: o.productId,
                name: product?.name || "Produto removido",
                image: images?.[0] || null,
                count: o._sum.quantity || 0,
                orders: o._count.productId,
            };
        });

        return NextResponse.json({ 
            type: "sales", 
            data, 
            period: { start, end },
            pagination: {
                page,
                pageSize,
                total,
                totalPages: Math.ceil(total / pageSize),
            }
        });
    } catch (error) {
        console.error("Analytics error:", error);
        return NextResponse.json(
            { error: "Erro ao buscar analytics" },
            { status: 500 }
        );
    }
}
