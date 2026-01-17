import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";

function parseImages(images: unknown): string[] {
    if (Array.isArray(images)) return images;
    if (typeof images === "string") {
        try {
            const parsed = JSON.parse(images);
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    }
    return [];
}

export async function GET() {
    const unauthorized = await requireAdmin();
    if (unauthorized) return unauthorized;

    try {
        const products = await db.product.findMany({
            include: { category: true },
            orderBy: { createdAt: "desc" },
        });

        const formatted = products.map((p) => ({
            ...p,
            images: parseImages(p.images),
        }));

        return NextResponse.json(formatted);
    } catch (error) {
        console.error("Failed to fetch products:", error);
        return NextResponse.json(
            { error: "Failed to fetch products" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    const unauthorized = await requireAdmin();
    if (unauthorized) return unauthorized;

    try {
        const body = await request.json();

        const product = await db.product.create({
            data: {
                name: body.name,
                slug: body.slug,
                description: body.description || "",
                price: body.price,
                comparePrice: body.comparePrice,
                categoryId: body.categoryId,
                images: body.images,
                sizes: body.sizes,
                colors: body.colors,
                stock: body.stock,
                weight: body.weight,
                isNew: body.isNew || false,
                isFeatured: body.isFeatured || false,
            },
        });

        return NextResponse.json(product);
    } catch (error) {
        console.error("Failed to create product:", error);
        return NextResponse.json(
            { error: "Failed to create product" },
            { status: 500 }
        );
    }
}
