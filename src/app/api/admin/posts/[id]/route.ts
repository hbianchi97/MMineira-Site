import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const unauthorized = await requireAdmin();
    if (unauthorized) return unauthorized;

    const { id } = await params;

    try {
        const post = await db.post.findUnique({
            where: { id },
        });

        if (!post) {
            return NextResponse.json(
                { error: "Post não encontrado" },
                { status: 404 }
            );
        }

        return NextResponse.json(post);
    } catch (error) {
        console.error("Failed to fetch post:", error);
        return NextResponse.json(
            { error: "Failed to fetch post" },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const unauthorized = await requireAdmin();
    if (unauthorized) return unauthorized;

    const { id } = await params;

    try {
        const body = await request.json();

        const existingPost = await db.post.findUnique({ where: { id } });
        const wasPublished = existingPost?.isPublished;
        const isNowPublished = body.isPublished;

        const post = await db.post.update({
            where: { id },
            data: {
                title: body.title,
                slug: body.slug,
                excerpt: body.excerpt,
                content: body.content,
                imageUrl: body.imageUrl,
                isPublished: body.isPublished ?? false,
                isFeatured: body.isFeatured ?? false,
                publishedAt: !wasPublished && isNowPublished 
                    ? new Date() 
                    : existingPost?.publishedAt,
            },
        });

        return NextResponse.json(post);
    } catch (error) {
        console.error("Failed to update post:", error);
        return NextResponse.json(
            { error: "Failed to update post" },
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

    const { id } = await params;

    try {
        await db.post.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Failed to delete post:", error);
        return NextResponse.json(
            { error: "Failed to delete post" },
            { status: 500 }
        );
    }
}
