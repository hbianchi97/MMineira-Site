import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET() {
    const unauthorized = await requireAdmin();
    if (unauthorized) return unauthorized;

    try {
        const categories = await db.category.findMany({
            orderBy: { sortOrder: "asc" },
        });
        return NextResponse.json(categories);
    } catch (error) {
        console.error("Failed to fetch categories:", error);
        return NextResponse.json(
            { error: "Failed to fetch categories" },
            { status: 500 }
        );
    }
}
