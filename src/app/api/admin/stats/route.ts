import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET() {
    const unauthorized = await requireAdmin();
    if (unauthorized) return unauthorized;

    try {
        const [totalProducts, totalCategories, featuredProducts, newProducts] =
            await Promise.all([
                db.product.count(),
                db.category.count(),
                db.product.count({ where: { isFeatured: true } }),
                db.product.count({ where: { isNew: true } }),
            ]);

        return NextResponse.json({
            totalProducts,
            totalCategories,
            featuredProducts,
            newProducts,
        });
    } catch (error) {
        console.error("Failed to fetch stats:", error);
        return NextResponse.json(
            { error: "Failed to fetch stats" },
            { status: 500 }
        );
    }
}
