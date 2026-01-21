import { db } from "./db";
import { sendEmail } from "./email";
import { LowStockNotification } from "@/components/emails/LowStockNotification";
import React from "react";

/**
 * Checks if any of the provided product IDs have stock below the threshold
 * and sends an email notification to the administrator if they do.
 */
export async function checkStockLevels(productIds: string[]) {
    try {
        // Get global settings for the low stock threshold
        const settings = await db.adminSettings.findFirst();
        const threshold = settings?.lowStockThreshold ?? 3;

        // Fetch products that are below or at the threshold
        const lowStockProducts = await db.product.findMany({
            where: {
                id: { in: productIds },
                stock: { lte: threshold },
            },
        });

        if (lowStockProducts.length === 0) return;

        // In a real application, you would get the admin email from settings
        // For now, we'll use a placeholder or the one from settings if available
        const adminEmail = settings?.supportEmail || process.env.ADMIN_EMAIL || "admin@example.com";

        for (const product of lowStockProducts) {
            console.log(`[StockMonitor] Low stock detected for ${product.name}: ${product.stock} units (Threshold: ${threshold})`);

            await sendEmail({
                to: adminEmail,
                subject: `⚠️ Alerta de Estoque: ${product.name}`,
                react: React.createElement(LowStockNotification, { product: product as any, threshold }),
            });
        }
    } catch (error) {
        console.error("[StockMonitor] Error checking stock levels:", error);
    }
}
