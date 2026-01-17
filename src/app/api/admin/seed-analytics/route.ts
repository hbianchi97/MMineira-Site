import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
    const authError = await requireAdmin();
    if (authError) return authError;

    try {
        let salesCount = 100;
        let viewsCount = 200;
        
        try {
            const body = await request.json();
            salesCount = Math.min(Math.max(body.salesCount || 100, 1), 1000);
            viewsCount = Math.min(Math.max(body.viewsCount || 200, 1), 5000);
        } catch {
            // Use defaults if body is empty or invalid
        }

        const products = await db.product.findMany({
            select: { id: true },
        });

        if (products.length === 0) {
            return NextResponse.json({ error: "Nenhum produto encontrado" }, { status: 400 });
        }

        let user = await db.user.findFirst();
        if (!user) {
            user = await db.user.create({
                data: {
                    clerkId: `test-user-${Date.now()}`,
                    email: "teste@meninamineira.com",
                    name: "Usuario Teste",
                },
            });
        }

        const now = new Date();
        const ordersToCreate = [];
        const viewsToCreate = [];

        for (let i = 0; i < salesCount; i++) {
            const daysAgo = Math.floor(Math.random() * 45);
            const date = new Date(now);
            date.setDate(date.getDate() - daysAgo);
            date.setHours(Math.floor(Math.random() * 24));
            date.setMinutes(Math.floor(Math.random() * 60));

            const product = products[Math.floor(Math.random() * products.length)];
            const quantity = Math.floor(Math.random() * 3) + 1;
            const price = Math.floor(Math.random() * 20000) + 5000;

            ordersToCreate.push({
                userId: user.id,
                status: "PAID" as const,
                subtotal: price * quantity,
                shippingCost: 0,
                discount: 0,
                total: price * quantity,
                shippingAddress: {},
                createdAt: date,
                items: [{
                    productId: product.id,
                    name: "Produto Teste",
                    price,
                    quantity,
                    size: "M",
                }],
            });
        }

        for (let i = 0; i < viewsCount; i++) {
            const daysAgo = Math.floor(Math.random() * 45);
            const date = new Date(now);
            date.setDate(date.getDate() - daysAgo);
            date.setHours(Math.floor(Math.random() * 24));

            const product = products[Math.floor(Math.random() * products.length)];

            viewsToCreate.push({
                productId: product.id,
                sessionId: `seed-${crypto.randomUUID()}`,
                viewedAt: date,
            });
        }

        for (const orderData of ordersToCreate) {
            const { items, ...order } = orderData;
            await db.order.create({
                data: {
                    ...order,
                    items: {
                        create: items,
                    },
                },
            });
        }

        await db.productView.createMany({
            data: viewsToCreate,
        });

        return NextResponse.json({
            success: true,
            message: `Criados ${ordersToCreate.length} pedidos e ${viewsToCreate.length} visualizacoes`,
            created: {
                orders: ordersToCreate.length,
                views: viewsToCreate.length,
            },
        });
    } catch (error) {
        console.error("Seed error:", error);
        return NextResponse.json(
            { error: "Erro ao gerar dados de teste" },
            { status: 500 }
        );
    }
}

export async function DELETE() {
    const authError = await requireAdmin();
    if (authError) return authError;

    try {
        const existingData = {
            orders: await db.order.count(),
            orderItems: await db.orderItem.count(),
            productViews: await db.productView.count(),
            timestamp: new Date().toISOString(),
        };

        console.log("=== DADOS ANTES DE ZERAR ===");
        console.log(JSON.stringify(existingData, null, 2));
        console.log("============================");

        await db.orderItem.deleteMany({});
        await db.order.deleteMany({});
        await db.productView.deleteMany({});

        return NextResponse.json({
            success: true,
            message: "Todos os dados de analytics foram removidos",
            deletedData: existingData,
        });
    } catch (error) {
        console.error("Clear error:", error);
        return NextResponse.json(
            { error: "Erro ao zerar dados" },
            { status: 500 }
        );
    }
}
