import { NextRequest, NextResponse } from "next/server";
import { getPublicURL } from "@/lib/object-storage";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    try {
        const { path } = await params;
        const objectPath = `/objects/${path.join("/")}`;
        const signedURL = await getPublicURL(objectPath);
        return NextResponse.redirect(signedURL);
    } catch (error) {
        console.error("Error serving object:", error);
        return NextResponse.json(
            { error: "Objeto nao encontrado" },
            { status: 404 }
        );
    }
}
