import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;

        const product = await db.product.findUnique({
            where: { id: id },
            select: { categoryId: true },
        });

        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        const relatedProducts = await db.product.findMany({
            where: {
                categoryId: product.categoryId,
                id: {
                    not: id,
                },
            },
            take: 4,
        });

        return NextResponse.json(relatedProducts);
    } catch (error) {
        console.error("Failed to fetch related products:", error);
        return NextResponse.json(
            { error: "Failed to fetch related products" },
            { status: 500 }
        );
    }
}
