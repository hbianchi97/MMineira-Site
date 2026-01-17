import { NextResponse } from "next/server";
import { getUploadURL } from "@/lib/object-storage";
import { requireAdmin } from "@/lib/admin-auth";

export async function POST(request: Request) {
    const authError = await requireAdmin();
    if (authError) return authError;

    try {
        const { name, size, contentType } = await request.json();

        if (!name) {
            return NextResponse.json(
                { error: "Nome do arquivo obrigatorio" },
                { status: 400 }
            );
        }

        const { uploadURL, objectPath } = await getUploadURL();

        return NextResponse.json({
            uploadURL,
            objectPath,
            metadata: { name, size, contentType },
        });
    } catch (error) {
        console.error("Error generating upload URL:", error);
        return NextResponse.json(
            { error: "Erro ao gerar URL de upload" },
            { status: 500 }
        );
    }
}
