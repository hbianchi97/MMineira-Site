"use client";

import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import {
    LayoutDashboard,
    Package,
    Settings,
    ArrowLeft,
    Store,
    Newspaper,
} from "lucide-react";

const adminEmails = ["admin@meninamineira.com.br"];

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isLoaded, isSignedIn, user } = useUser();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (isLoaded && !isSignedIn) {
            router.push("/sign-in");
        }
    }, [isLoaded, isSignedIn, router]);

    if (!isLoaded) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!isSignedIn) {
        return null;
    }

    const navItems = [
        { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
        { href: "/admin/produtos", label: "Produtos", icon: Package },
        { href: "/admin/novidades", label: "Novidades", icon: Newspaper },
        { href: "/admin/configuracoes", label: "Configuracoes", icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 z-30">
                <div className="flex flex-col h-full">
                    <div className="p-6 border-b border-gray-200">
                        <Link href="/" className="flex items-center gap-2">
                            <Store className="h-6 w-6 text-amber-600" />
                            <span className="font-bold text-lg text-amber-700">
                                Admin
                            </span>
                        </Link>
                    </div>

                    <nav className="flex-1 p-4 space-y-1">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                                        isActive
                                            ? "bg-amber-50 text-amber-700"
                                            : "text-gray-600 hover:bg-gray-50"
                                    }`}
                                >
                                    <item.icon className="h-5 w-5" />
                                    <span className="font-medium">{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="p-4 border-t border-gray-200">
                        <Link
                            href="/"
                            className="flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Voltar para a loja
                        </Link>
                    </div>
                </div>
            </aside>

            <main className="ml-64 min-h-screen">
                <div className="p-8">{children}</div>
            </main>
        </div>
    );
}
