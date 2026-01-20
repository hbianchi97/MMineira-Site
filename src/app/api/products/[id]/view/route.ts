import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { auth } from "@clerk/nextjs/server";

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;

        const product = await db.product.findUnique({
            where: { id },
            select: { id: true },
        });

        if (!product) {
            return NextResponse.json({ error: "Produto nao encontrado" }, { status: 404 });
        }

        const cookieStore = await cookies();
        let sessionId = cookieStore.get("session_id")?.value;

        if (!sessionId) {
            sessionId = crypto.randomUUID();
        }

        let userId: string | null = null;
        try {
            const { userId: authUserId } = await auth();
            userId = authUserId;
        } catch {
        }

        await db.productView.create({
            data: {
                productId: product.id,
                sessionId,
                userId,
            },
        });

        const response = NextResponse.json({ success: true });

        if (!cookieStore.get("session_id")) {
            response.cookies.set("session_id", sessionId, {
                httpOnly: true,
                maxAge: 60 * 60 * 24 * 365,
                path: "/",
            });
        }

        return response;
    } catch (error) {
        console.error("View tracking error:", error);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
