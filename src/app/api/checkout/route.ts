import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { checkStockLevels } from "@/lib/stock-monitor";

export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth();
        const body = await req.json();
        const { items, customer, shippingMethod, paymentMethod, totals } = body;

        if (!items || items.length === 0) {
            return NextResponse.json({ error: "Carrinho vazio" }, { status: 400 });
        }

        // 1. Find or create user in our DB
        let dbUser = await db.user.findUnique({
            where: { clerkId: userId || "guest" },
        });

        if (!dbUser && userId) {
            // If Clerk authenticated but not in our DB yet
            // This normally happens via webhook, but we can do a fallback
            dbUser = await db.user.create({
                data: {
                    clerkId: userId,
                    email: customer.email,
                    name: customer.name,
                },
            });
        }

        // 2. Start a transaction to ensure atomic order creation and stock decrement
        const result = await db.$transaction(async (tx) => {
            // Create the order
            const order = await tx.order.create({
                data: {
                    userId: dbUser?.id,
                    status: paymentMethod === "PIX" ? "PENDING" : "PAID", // Simulation
                    subtotal: totals.subtotal,
                    shippingCost: totals.shipping,
                    discount: totals.discount,
                    total: totals.total,
                    shippingAddress: {
                        name: customer.name,
                        email: customer.email,
                        phone: customer.phone,
                        cpf: customer.cpf,
                        ...customer.address
                    },
                    items: {
                        create: items.map((item: any) => ({
                            productId: item.id,
                            name: item.name,
                            price: item.price,
                            quantity: item.quantity,
                            size: item.size,
                        })),
                    },
                },
            });

            // Decrement stock for each item
            for (const item of items) {
                await tx.product.update({
                    where: { id: item.id },
                    data: {
                        stock: {
                            decrement: item.quantity,
                        },
                    },
                });
            }

            return order;
        });

        // 3. Check stock levels after transaction completes (outside transaction for better performance)
        const productIds = items.map((item: any) => item.id);
        // We run this asynchronously so it doesn't block the response
        checkStockLevels(productIds).catch(err => console.error("Error in stock check:", err));

        return NextResponse.json({
            success: true,
            orderId: result.id,
            message: "Pedido realizado com sucesso"
        });

    } catch (error) {
        console.error("[CheckoutAPI] Error:", error);
        return NextResponse.json(
            { error: "Erro ao processar checkout" },
            { status: 500 }
        );
    }
}
