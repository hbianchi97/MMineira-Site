"use client";

import { useEffect, useState } from "react";
import { Package, ShoppingBag, TrendingUp, Users } from "lucide-react";

interface Stats {
    totalProducts: number;
    totalCategories: number;
    featuredProducts: number;
    newProducts: number;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            try {
                const res = await fetch("/api/admin/stats");
                if (res.ok) {
                    const data = await res.json();
                    setStats(data);
                }
            } catch (error) {
                console.error("Failed to fetch stats:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchStats();
    }, []);

    const statCards = [
        {
            label: "Total de Produtos",
            value: stats?.totalProducts ?? 0,
            icon: Package,
            color: "bg-blue-500",
        },
        {
            label: "Categorias",
            value: stats?.totalCategories ?? 0,
            icon: ShoppingBag,
            color: "bg-green-500",
        },
        {
            label: "Produtos em Destaque",
            value: stats?.featuredProducts ?? 0,
            icon: TrendingUp,
            color: "bg-amber-500",
        },
        {
            label: "Novidades",
            value: stats?.newProducts ?? 0,
            icon: Users,
            color: "bg-purple-500",
        },
    ];

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statCards.map((card) => (
                    <div
                        key={card.label}
                        className="bg-white rounded-xl border border-gray-200 p-6"
                    >
                        <div className="flex items-center gap-4">
                            <div
                                className={`w-12 h-12 rounded-lg ${card.color} flex items-center justify-center`}
                            >
                                <card.icon className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">{card.label}</p>
                                <p className="text-2xl font-bold">
                                    {loading ? "-" : card.value}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-semibold mb-4">Ações Rápidas</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <a
                        href="/admin/produtos"
                        className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-center"
                    >
                        <Package className="h-8 w-8 mx-auto mb-2 text-amber-600" />
                        <span className="text-sm font-medium">Ver Produtos</span>
                    </a>
                    <a
                        href="/admin/dashboard"
                        className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-center"
                    >
                        <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-600" />
                        <span className="text-sm font-medium">Dashboards</span>
                    </a>
                    <a
                        href="/admin/configuracoes"
                        className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-center"
                    >
                        <TrendingUp className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                        <span className="text-sm font-medium">Configurações</span>
                    </a>
                    <a
                        href="/"
                        target="_blank"
                        className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-center"
                    >
                        <ShoppingBag className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                        <span className="text-sm font-medium">Ver Loja</span>
                    </a>
                </div>
            </div>
        </div>
    );
}
