import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET() {
    const unauthorized = await requireAdmin();
    if (unauthorized) return unauthorized;

    try {
        const coupons = await db.coupon.findMany({
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(coupons);
    } catch (error) {
        console.error("Failed to fetch coupons:", error);
        return NextResponse.json(
            { error: "Failed to fetch coupons" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    const unauthorized = await requireAdmin();
    if (unauthorized) return unauthorized;

    try {
        const body = await request.json();

        const coupon = await db.coupon.create({
            data: {
                code: body.code,
                discountType: body.discountType,
                discountValue: body.discountValue,
                expiresAt: body.expiresAt,
                isActive: body.isActive,
                maxUses: body.maxUses,
                minPurchaseValue: body.minPurchaseValue,
            },
        });

        return NextResponse.json(coupon);
    } catch (error) {
        console.error("Failed to create coupon:", error);
        return NextResponse.json(
            { error: "Failed to create coupon" },
            { status: 500 }
        );
    }
}
