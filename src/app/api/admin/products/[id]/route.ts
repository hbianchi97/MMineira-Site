import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { createAuditLog } from "@/lib/audit-log";
import { cache } from "@/lib/redis";

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const unauthorized = await requireAdmin();
    if (unauthorized) return unauthorized;

    try {
        const { id } = await params;
        const body = await request.json();

        const product = await db.product.update({
            where: { id },
            data: {
                name: body.name,
                slug: body.slug,
                description: body.description,
                price: body.price,
                comparePrice: body.comparePrice,
                categoryId: body.categoryId,
                images: body.images,
                sizes: body.sizes,
                colors: body.colors,
                stock: body.stock,
                weight: body.weight,
                isNew: body.isNew,
                isFeatured: body.isFeatured,
            },
        });

        // Invalidate cache and log action
        await Promise.all([
            cache.clearByPrefix("catalog:"),
            createAuditLog({
                action: "UPDATE",
                entity: "PRODUCT",
                entityId: id,
                details: { name: product.name, slug: product.slug }
            })
        ]);

        return NextResponse.json(product);
    } catch (error) {
        console.error("Failed to update product:", error);
        return NextResponse.json(
            { error: "Failed to update product" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const unauthorized = await requireAdmin();
    if (unauthorized) return unauthorized;

    try {
        const { id } = await params;

        const deletedProduct = await db.product.delete({
            where: { id },
        });

        // Invalidate cache and log action
        await Promise.all([
            cache.clearByPrefix("catalog:"),
            createAuditLog({
                action: "DELETE",
                entity: "PRODUCT",
                entityId: id,
                details: { name: deletedProduct.name, slug: deletedProduct.slug }
            })
        ]);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Failed to delete product:", error);
        return NextResponse.json(
            { error: "Failed to delete product" },
            { status: 500 }
        );
    }
}
