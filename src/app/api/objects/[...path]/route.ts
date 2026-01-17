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
        
        const response = await fetch(signedURL);
        if (!response.ok) {
            return NextResponse.json(
                { error: "Objeto nao encontrado" },
                { status: 404 }
            );
        }
        
        const contentType = response.headers.get("content-type") || "application/octet-stream";
        const blob = await response.blob();
        
        return new NextResponse(blob, {
            headers: {
                "Content-Type": contentType,
                "Cache-Control": "public, max-age=31536000, immutable",
            },
        });
    } catch (error) {
        console.error("Error serving object:", error);
        return NextResponse.json(
            { error: "Objeto nao encontrado" },
            { status: 404 }
        );
    }
}
