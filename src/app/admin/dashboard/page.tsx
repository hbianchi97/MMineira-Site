"use client";

import { useState, useEffect } from "react";
import {
    BarChart3,
    Eye,
    ShoppingCart,
    Loader2,
    Calendar,
    TrendingUp,
    Database,
} from "lucide-react";

interface ProductAnalytics {
    productId: string;
    name: string;
    image: string | null;
    count: number;
    orders?: number;
}

interface AnalyticsResponse {
    type: string;
    data: ProductAnalytics[];
    period: {
        start: string;
        end: string;
    };
}

export default function AnalyticsDashboard() {
    const [analyticsType, setAnalyticsType] = useState<"sales" | "views">("sales");
    const [startDate, setStartDate] = useState(() => {
        const d = new Date();
        d.setDate(d.getDate() - 30);
        return d.toISOString().split("T")[0];
    });
    const [endDate, setEndDate] = useState(() => {
        return new Date().toISOString().split("T")[0];
    });
    const [data, setData] = useState<ProductAnalytics[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [seeding, setSeeding] = useState(false);
    const [seedMessage, setSeedMessage] = useState<string | null>(null);

    useEffect(() => {
        fetchAnalytics();
    }, [analyticsType, startDate, endDate]);

    const fetchAnalytics = async () => {
        setLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams({
                type: analyticsType,
                startDate,
                endDate,
            });

            const res = await fetch(`/api/admin/analytics?${params}`);

            if (!res.ok) {
                if (res.status === 401) {
                    setError("Voce precisa estar logado para acessar esta pagina.");
                } else if (res.status === 403) {
                    setError("Voce nao tem permissao para acessar esta pagina.");
                } else {
                    setError("Erro ao carregar dados de analytics.");
                }
                return;
            }

            const result: AnalyticsResponse = await res.json();
            setData(result.data);
        } catch (err) {
            console.error("Analytics error:", err);
            setError("Erro de conexao. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    const maxCount = Math.max(...data.map((d) => d.count), 1);
    const totalCount = data.reduce((sum, d) => sum + d.count, 0);

    const handleSeedData = async () => {
        if (!confirm("Isso ira gerar 300 vendas e 500 visualizacoes de teste. Continuar?")) return;

        setSeeding(true);
        setSeedMessage(null);

        try {
            const res = await fetch("/api/admin/seed-analytics", { method: "POST" });
            const result = await res.json();

            if (res.ok) {
                setSeedMessage(result.message);
                fetchAnalytics();
            } else {
                setSeedMessage(result.error || "Erro ao gerar dados");
            }
        } catch (err) {
            setSeedMessage("Erro de conexao");
        } finally {
            setSeeding(false);
        }
    };

    const getDisplayUrl = (url: string | null) => {
        if (!url) return null;
        if (url.startsWith("/objects/")) {
            return `/api${url}`;
        }
        return url;
    };

    const formatDateRange = () => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        return `${diffDays} dias`;
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <BarChart3 className="h-7 w-7 text-amber-600" />
                    Dashboard de Analytics
                </h1>
                <button
                    onClick={handleSeedData}
                    disabled={seeding}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition disabled:opacity-50"
                >
                    {seeding ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Database className="h-4 w-4" />
                    )}
                    Gerar Dados de Teste
                </button>
            </div>

            {seedMessage && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                    {seedMessage}
                </div>
            )}

            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex gap-2">
                        <button
                            onClick={() => setAnalyticsType("sales")}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                                analyticsType === "sales"
                                    ? "bg-amber-600 text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                        >
                            <ShoppingCart className="h-4 w-4" />
                            Mais Vendidos
                        </button>
                        <button
                            onClick={() => setAnalyticsType("views")}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                                analyticsType === "views"
                                    ? "bg-amber-600 text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                        >
                            <Eye className="h-4 w-4" />
                            Mais Acessados
                        </button>
                    </div>

                    <div className="flex items-center gap-2 ml-auto">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-amber-500"
                        />
                        <span className="text-gray-400">ate</span>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-amber-500"
                        />
                    </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <TrendingUp className="h-4 w-4" />
                        <span>
                            Mostrando {analyticsType === "sales" ? "produtos mais vendidos" : "produtos mais acessados"} nos ultimos {formatDateRange()}
                        </span>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-bold text-amber-600">{totalCount}</p>
                        <p className="text-xs text-gray-500">
                            {analyticsType === "sales" ? "vendas totais" : "visualizacoes totais"}
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {loading ? (
                    <div className="p-12 flex items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
                    </div>
                ) : error ? (
                    <div className="p-8 text-center">
                        <p className="text-red-600 mb-4">{error}</p>
                        <a href="/sign-in" className="text-amber-600 hover:underline">
                            Fazer login
                        </a>
                    </div>
                ) : data.length === 0 ? (
                    <div className="p-12 text-center">
                        <BarChart3 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Sem dados para exibir
                        </h3>
                        <p className="text-gray-500">
                            Nao ha {analyticsType === "sales" ? "vendas" : "visualizacoes"} registradas no periodo selecionado.
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {data.map((item, index) => (
                            <div
                                key={item.productId}
                                className="flex items-center gap-4 p-4 hover:bg-gray-50 transition"
                            >
                                <span className="w-8 h-8 flex items-center justify-center bg-amber-100 text-amber-700 font-bold rounded-full text-sm">
                                    {index + 1}
                                </span>

                                <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                    {item.image ? (
                                        <img
                                            src={getDisplayUrl(item.image) || ""}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).style.display = "none";
                                            }}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            ?
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h3 className="font-medium text-gray-900 truncate">
                                        {item.name}
                                    </h3>
                                    <div className="mt-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full transition-all duration-500"
                                            style={{ width: `${(item.count / maxCount) * 100}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="text-right flex-shrink-0">
                                    <p className="text-lg font-bold text-gray-900">
                                        {item.count}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {analyticsType === "sales" ? "vendas" : "visualizacoes"}
                                    </p>
                                    {item.orders && analyticsType === "sales" && (
                                        <p className="text-xs text-gray-400">
                                            {item.orders} pedidos
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
