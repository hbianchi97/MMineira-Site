import { db } from "./db";
import { auth } from "@clerk/nextjs/server";
import { headers } from "next/headers";

interface AuditLogParams {
    action: string;
    entity: string;
    entityId: string;
    details?: any;
}

/**
 * Registers an administrative action in the audit logs.
 */
export async function createAuditLog({ action, entity, entityId, details }: AuditLogParams) {
    try {
        const { userId } = await auth();
        const headerList = await headers();
        const ip = headerList.get("x-forwarded-for") || headerList.get("x-real-ip");
        const userAgent = headerList.get("user-agent");

        await db.auditLog.create({
            data: {
                userId,
                action,
                entity,
                entityId,
                details: details ? JSON.stringify(details) : null,
                ip,
                userAgent,
            },
        });
    } catch (error) {
        console.error("[AuditLog] Failed to create log:", error);
    }
}
