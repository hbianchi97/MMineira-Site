import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ couponId: string }> }
) {
    const unauthorized = await requireAdmin();
    if (unauthorized) return unauthorized;

    try {
        const { couponId } = await context.params;
        const coupon = await db.coupon.findUnique({
            where: { id: couponId },
        });

        if (!coupon) {
            return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
        }

        return NextResponse.json(coupon);
    } catch (error) {
        console.error("Failed to fetch coupon:", error);
        return NextResponse.json(
            { error: "Failed to fetch coupon" },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    context: { params: Promise<{ couponId: string }> }
) {
    const unauthorized = await requireAdmin();
    if (unauthorized) return unauthorized;

    try {
        const { couponId } = await context.params;
        const body = await request.json();

        const coupon = await db.coupon.update({
            where: { id: couponId },
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
        console.error("Failed to update coupon:", error);
        return NextResponse.json(
            { error: "Failed to update coupon" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ couponId: string }> }
) {
    const unauthorized = await requireAdmin();
    if (unauthorized) return unauthorized;

    try {
        const { couponId } = await context.params;

        await db.coupon.delete({
            where: { id: couponId },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Failed to delete coupon:", error);
        return NextResponse.json(
            { error: "Failed to delete coupon" },
            { status: 500 }
        );
    }
}
