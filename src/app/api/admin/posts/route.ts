import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET() {
    const unauthorized = await requireAdmin();
    if (unauthorized) return unauthorized;

    try {
        const posts = await db.post.findMany({
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(posts);
    } catch (error) {
        console.error("Failed to fetch posts:", error);
        return NextResponse.json(
            { error: "Failed to fetch posts" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    const unauthorized = await requireAdmin();
    if (unauthorized) return unauthorized;

    try {
        const body = await request.json();

        const slug = body.slug || body.title
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");

        const post = await db.post.create({
            data: {
                title: body.title,
                slug,
                excerpt: body.excerpt,
                content: body.content,
                imageUrl: body.imageUrl,
                isPublished: body.isPublished ?? false,
                isFeatured: body.isFeatured ?? false,
                publishedAt: body.isPublished ? new Date() : null,
            },
        });

        return NextResponse.json(post);
    } catch (error) {
        console.error("Failed to create post:", error);
        return NextResponse.json(
            { error: "Failed to create post" },
            { status: 500 }
        );
    }
}
