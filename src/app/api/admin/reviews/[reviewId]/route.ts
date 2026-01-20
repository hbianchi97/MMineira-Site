import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";

export async function PUT(
    request: NextRequest,
    { params }: { params: { reviewId: string } }
) {
    const unauthorized = await requireAdmin();
    if (unauthorized) return unauthorized;

    try {
        const { reviewId } = params;
        const body = await request.json();

        const review = await db.review.update({
            where: { id: reviewId },
            data: {
                isApproved: body.isApproved,
            },
        });

        return NextResponse.json(review);
    } catch (error)_ {
        console.error("Failed to update review:", error);
        return NextResponse.json(
            { error: "Failed to update review" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { reviewId: string } }
) {
    const unauthorized = await requireAdmin();
    if (unauthorized) return unauthorized;

    try {
        const { reviewId } = params;

        await db.review.delete({
            where: { id: reviewId },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Failed to delete review:", error);
        return NextResponse.json(
            { error: "Failed to delete review" },
            { status: 500 }
        );
    }
}
