import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { checkStockLevels } from "@/lib/stock-monitor";

export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth();
        const body = await req.json();
        console.log("Checkout Body:", JSON.stringify(body, null, 2));
        const { items, customer, shippingMethod, paymentMethod, totals } = body;

        if (!items || items.length === 0) {
            return NextResponse.json({ error: "Carrinho vazio" }, { status: 400 });
        }

        // 0. Validate that all products exist in DB
        const productIdsInCart = items.map((item: any) => item.id);
        const existingProducts = await db.product.findMany({
            where: { id: { in: productIdsInCart } },
            select: { id: true }
        });

        if (existingProducts.length !== productIdsInCart.length) {
            const existingIds = existingProducts.map(p => p.id);
            const missingIds = productIdsInCart.filter((id: string) => !existingIds.includes(id));
            console.warn("[CheckoutAPI] Missing products in DB:", missingIds);
            return NextResponse.json({
                error: "Alguns produtos no seu carrinho não existem mais ou estão desatualizados. Por favor, limpe seu carrinho e adicione-os novamente.",
                missingIds
            }, { status: 400 });
        }

        // 1. Find or create user in our DB (handle guest as a real user entry if needed)
        const effectiveClerkId = userId || "guest-session";
        let dbUser = await db.user.findUnique({
            where: { clerkId: effectiveClerkId },
        });

        if (!dbUser) {
            // Create a placeholder user for this guest or authenticated user
            dbUser = await db.user.create({
                data: {
                    clerkId: effectiveClerkId,
                    email: customer.email || `guest-${Date.now()}@example.com`,
                    name: customer.name || "Cliente Convidado",
                },
            });
        }

        // 2. Start a transaction to ensure atomic order creation and stock decrement
        const result = await db.$transaction(async (tx) => {
            // Create the order
            const order = await tx.order.create({
                data: {
                    userId: dbUser!.id, // Always has a user now
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
                        street: customer.address.street,
                        number: customer.address.number,
                        complement: customer.address.complement,
                        neighborhood: customer.address.neighborhood,
                        city: customer.address.city,
                        state: customer.address.state,
                        zip: customer.address.cep || customer.address.zip, // Fix cep/zip mismatch
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

    } catch (error: any) {
        console.error("[CheckoutAPI] CRITICAL ERROR:", error);
        if (error.code) console.error("[CheckoutAPI] Prisma Error Code:", error.code);
        if (error.meta) console.error("[CheckoutAPI] Prisma Error Meta:", error.meta);

        return NextResponse.json(
            { error: "Erro ao processar checkout", details: error.message },
            { status: 500 }
        );
    }
}
