import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { sendEmail } from '@/lib/email'
import { LowStockNotification } from '@/components/emails/LowStockNotification'
import React from 'react'

export async function POST(req: Request) {
    const HEADER_PAYLOAD = await headers();
    const svix_id = HEADER_PAYLOAD.get("svix-id");
    const svix_timestamp = HEADER_PAYLOAD.get("svix-timestamp");
    const svix_signature = HEADER_PAYLOAD.get("svix-signature");

    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new Response('Error occured -- no svix headers', {
            status: 400
        })
    }

    const payload = await req.json()
    const body = JSON.stringify(payload)

    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || '')

    let evt: WebhookEvent

    try {
        evt = wh.verify(body, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
        }) as WebhookEvent
    } catch (err) {
        console.error('Error verifying webhook:', err);
        return new Response('Error occured', {
            status: 400
        })
    }

    const eventType = evt.type;

    if (eventType === 'user.created') {
        const { id, email_addresses, first_name, last_name } = evt.data;

        await db.user.create({
            data: {
                clerkId: id,
                email: email_addresses[0]?.email_address,
                name: `${first_name} ${last_name}`,
                creditBalance: {
                    create: {
                        clerkUserId: id,
                        creditsRemaining: 100
                    }
                }
            }
        });
    }

    if (eventType === 'user.updated') {
        const { id, email_addresses, first_name, last_name } = evt.data;

        await db.user.update({
            where: { clerkId: id },
            data: {
                email: email_addresses[0]?.email_address,
                name: `${first_name} ${last_name}`,
            }
        });
    }

    if (eventType === 'user.deleted') {
        const { id } = evt.data;

        await db.user.delete({
            where: { clerkId: id! }
        });
    }

    if (eventType === 'paymentAttempt.updated') {
        const { status, metadata } = evt.data as any;

        if (status === 'paid') {
            const orderId = metadata?.orderId as string;

            if (orderId) {
                const settings = await db.adminSettings.findUnique({
                    where: { id: "singleton" },
                }) || { lowStockThreshold: 3 };

                const order = await db.order.findUnique({
                    where: { id: orderId },
                    include: { items: true },
                });

                if (order && order.status !== 'PAID') {
                    // Update order status to PAID
                    await db.order.update({
                        where: { id: orderId },
                        data: { status: 'PAID' }
                    });

                    // Check for low stock on items (stock was already decremented at checkout)
                    for (const item of order.items) {
                        const product = await db.product.findUnique({
                            where: { id: item.productId },
                        });

                        if (product && product.stock <= settings.lowStockThreshold) {
                            const adminEmails = process.env.ADMIN_EMAILS?.split(',');
                            if (adminEmails) {
                                await sendEmail({
                                    to: adminEmails,
                                    subject: `Alerta de Estoque Baixo: ${product.name}`,
                                    react: React.createElement(LowStockNotification, {
                                        product: { ...product, stock: product.stock } as any,
                                        threshold: settings.lowStockThreshold
                                    }),
                                });
                            }
                        }
                    }
                }
            }
        }
    }

    return new Response('', { status: 200 })
}
