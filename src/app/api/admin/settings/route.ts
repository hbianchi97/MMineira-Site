import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET() {
    const unauthorized = await requireAdmin();
    if (unauthorized) return unauthorized;

    try {
        const settings = await db.adminSettings.findUnique({
            where: { id: "singleton" },
        });

        if (!settings) {
            // Create default settings if they don't exist
            const newSettings = await db.adminSettings.create({
                data: { id: "singleton" },
            });
            return NextResponse.json(newSettings);
        }

        return NextResponse.json(settings);
    } catch (error) {
        console.error("Failed to fetch settings:", error);
        return NextResponse.json(
            { error: "Failed to fetch settings" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    const unauthorized = await requireAdmin();
    if (unauthorized) return unauthorized;

    try {
        const body = await request.json();

        const settings = await db.adminSettings.upsert({
            where: { id: "singleton" },
            update: {
                lowStockThreshold: body.lowStockThreshold,
            },
            create: {
                id: "singleton",
                lowStockThreshold: body.lowStockThreshold,
            },
        });

        return NextResponse.json(settings);
    } catch (error) {
        console.error("Failed to update settings:", error);
        return NextResponse.json(
            { error: "Failed to update settings" },
            { status: 500 }
        );
    }
}
