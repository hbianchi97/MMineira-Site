import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const ADMIN_EMAILS = ["admin@meninamineira.com.br"];

export async function isAdmin(): Promise<boolean> {
    const { userId } = await auth();
    if (!userId) return false;

    const user = await currentUser();
    if (!user) return false;

    const primaryEmail = user.emailAddresses.find(
        (e) => e.id === user.primaryEmailAddressId
    )?.emailAddress;

    return primaryEmail ? ADMIN_EMAILS.includes(primaryEmail) : false;
}

export async function requireAdmin(): Promise<NextResponse | null> {
    const { userId } = await auth();

    if (!userId) {
        return NextResponse.json(
            { error: "Não autenticado" },
            { status: 401 }
        );
    }

    const user = await currentUser();
    if (!user) {
        return NextResponse.json(
            { error: "Usuário não encontrado" },
            { status: 401 }
        );
    }

    const primaryEmail = user.emailAddresses.find(
        (e) => e.id === user.primaryEmailAddressId
    )?.emailAddress;

    const isAdminUser = primaryEmail && ADMIN_EMAILS.includes(primaryEmail);

    if (!isAdminUser) {
        return NextResponse.json(
            { error: "Acesso negado. Apenas administradores." },
            { status: 403 }
        );
    }

    return null;
}
