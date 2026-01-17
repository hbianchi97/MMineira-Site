import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";

export async function POST() {
    const authError = await requireAdmin();
    if (authError) return authError;

    try {
        const products = await db.product.findMany({
            select: { id: true },
        });

        if (products.length === 0) {
            return NextResponse.json({ error: "Nenhum produto encontrado" }, { status: 400 });
        }

        const user = await db.user.findFirst();
        if (!user) {
            return NextResponse.json({ error: "Nenhum usuario encontrado" }, { status: 400 });
        }

        const now = new Date();
        const ordersToCreate = [];
        const viewsToCreate = [];

        for (let i = 0; i < 100; i++) {
            const daysAgo = Math.floor(Math.random() * 15);
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

        for (let i = 0; i < 200; i++) {
            const daysAgo = 15 + Math.floor(Math.random() * 30);
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

        for (let i = 0; i < 500; i++) {
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
        });
    } catch (error) {
        console.error("Seed error:", error);
        return NextResponse.json(
            { error: "Erro ao gerar dados de teste" },
            { status: 500 }
        );
    }
}
