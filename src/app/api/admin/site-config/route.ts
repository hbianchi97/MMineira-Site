import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET() {
    const unauthorized = await requireAdmin();
    if (unauthorized) return unauthorized;

    try {
        const configs = await db.siteConfig.findMany({
            orderBy: { pageKey: "asc" },
        });

        return NextResponse.json(configs);
    } catch (error) {
        console.error("Failed to fetch site configs:", error);
        return NextResponse.json(
            { error: "Failed to fetch site configs" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    const unauthorized = await requireAdmin();
    if (unauthorized) return unauthorized;

    try {
        const body = await request.json();

        const config = await db.siteConfig.upsert({
            where: { pageKey: body.pageKey },
            update: {
                imageUrl: body.imageUrl,
                title: body.title,
                subtitle: body.subtitle,
                description: body.description,
                isActive: body.isActive ?? true,
            },
            create: {
                pageKey: body.pageKey,
                imageUrl: body.imageUrl,
                title: body.title,
                subtitle: body.subtitle,
                description: body.description,
                isActive: body.isActive ?? true,
            },
        });

        return NextResponse.json(config);
    } catch (error) {
        console.error("Failed to save site config:", error);
        return NextResponse.json(
            { error: "Failed to save site config" },
            { status: 500 }
        );
    }
}
