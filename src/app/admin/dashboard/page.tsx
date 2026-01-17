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
    ChevronLeft,
    ChevronRight,
    Trash2,
    X,
} from "lucide-react";

interface ProductAnalytics {
    productId: string;
    name: string;
    image: string | null;
    count: number;
    orders?: number;
}

interface PaginationInfo {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
}

interface AnalyticsResponse {
    type: string;
    data: ProductAnalytics[];
    period: {
        start: string;
        end: string;
    };
    pagination: PaginationInfo;
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
    const [pagination, setPagination] = useState<PaginationInfo>({
        page: 1,
        pageSize: 10,
        total: 0,
        totalPages: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [seeding, setSeeding] = useState(false);
    const [clearing, setClearing] = useState(false);
    const [seedMessage, setSeedMessage] = useState<string | null>(null);
    const [seedSalesCount, setSeedSalesCount] = useState(100);
    const [seedViewsCount, setSeedViewsCount] = useState(200);
    const [showSeedModal, setShowSeedModal] = useState(false);

    useEffect(() => {
        fetchAnalytics();
    }, [analyticsType, startDate, endDate, pagination.page]);

    const fetchAnalytics = async () => {
        setLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams({
                type: analyticsType,
                startDate,
                endDate,
                page: pagination.page.toString(),
                pageSize: "10",
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
            setPagination(result.pagination);
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
        setSeeding(true);
        setSeedMessage(null);
        setShowSeedModal(false);

        try {
            const res = await fetch("/api/admin/seed-analytics", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    salesCount: seedSalesCount,
                    viewsCount: seedViewsCount,
                }),
            });
            const result = await res.json();

            if (res.ok) {
                setSeedMessage(result.message);
                fetchAnalytics();
            } else {
                setSeedMessage(result.error || "Erro ao gerar dados");
            }
        } catch {
            setSeedMessage("Erro de conexao");
        } finally {
            setSeeding(false);
        }
    };

    const handleClearData = async () => {
        if (!confirm("Tem certeza que deseja ZERAR todos os dados de vendas e acessos? Esta acao nao pode ser desfeita. Os dados serao registrados no log antes da exclusao.")) return;

        setClearing(true);
        setSeedMessage(null);

        try {
            const res = await fetch("/api/admin/seed-analytics", { method: "DELETE" });
            const result = await res.json();

            if (res.ok) {
                setSeedMessage(`Dados zerados: ${result.deletedData.orders} pedidos, ${result.deletedData.orderItems} itens, ${result.deletedData.productViews} visualizacoes`);
                fetchAnalytics();
            } else {
                setSeedMessage(result.error || "Erro ao zerar dados");
            }
        } catch {
            setSeedMessage("Erro de conexao");
        } finally {
            setClearing(false);
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

    const handlePrevPage = () => {
        if (pagination.page > 1) {
            setPagination((prev) => ({ ...prev, page: prev.page - 1 }));
        }
    };

    const handleNextPage = () => {
        if (pagination.page < pagination.totalPages) {
            setPagination((prev) => ({ ...prev, page: prev.page + 1 }));
        }
    };

    const handleTypeChange = (type: "sales" | "views") => {
        setAnalyticsType(type);
        setPagination((prev) => ({ ...prev, page: 1 }));
    };

    const getRank = (index: number) => {
        return (pagination.page - 1) * pagination.pageSize + index + 1;
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <BarChart3 className="h-7 w-7 text-amber-600" />
                    Dashboard de Analytics
                </h1>
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowSeedModal(true)}
                        disabled={seeding || clearing}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition disabled:opacity-50"
                    >
                        {seeding ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Database className="h-4 w-4" />
                        )}
                        Gerar Dados
                    </button>
                    <button
                        onClick={handleClearData}
                        disabled={seeding || clearing}
                        className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition disabled:opacity-50"
                    >
                        {clearing ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Trash2 className="h-4 w-4" />
                        )}
                        Zerar Dados
                    </button>
                </div>
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
                            onClick={() => handleTypeChange("sales")}
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
                            onClick={() => handleTypeChange("views")}
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
                            onChange={(e) => {
                                setStartDate(e.target.value);
                                setPagination((prev) => ({ ...prev, page: 1 }));
                            }}
                            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-amber-500"
                        />
                        <span className="text-gray-400">ate</span>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => {
                                setEndDate(e.target.value);
                                setPagination((prev) => ({ ...prev, page: 1 }));
                            }}
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
                        <p className="text-2xl font-bold text-amber-600">{pagination.total}</p>
                        <p className="text-xs text-gray-500">
                            {analyticsType === "sales" ? "produtos vendidos" : "produtos visualizados"}
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
                    <>
                        <div className="divide-y divide-gray-100">
                            {data.map((item, index) => (
                                <div
                                    key={item.productId}
                                    className="flex items-center gap-4 p-4 hover:bg-gray-50 transition"
                                >
                                    <span className="w-8 h-8 flex items-center justify-center bg-amber-100 text-amber-700 font-bold rounded-full text-sm">
                                        {getRank(index)}
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
                                        <div className="mt-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full transition-all duration-500"
                                                style={{ width: `${(item.count / maxCount) * 100}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div className="text-right flex-shrink-0 min-w-[80px]">
                                        <p className="text-xl font-bold text-amber-600">
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

                        <div className="p-6 border-t border-gray-100">
                            <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
                                <BarChart3 className="h-4 w-4 text-amber-600" />
                                Visualizacao em Barras - Pagina {pagination.page}
                            </h3>
                            <div className="flex items-end gap-2 h-48 bg-gray-50 rounded-xl p-4">
                                {data.map((item, index) => {
                                    const height = (item.count / maxCount) * 100;
                                    return (
                                        <div
                                            key={item.productId}
                                            className="flex-1 flex flex-col items-center gap-1 group"
                                        >
                                            <span className="text-xs font-bold text-amber-600">
                                                {item.count}
                                            </span>
                                            <div
                                                className="w-full bg-gradient-to-t from-amber-500 to-amber-300 rounded-t-lg transition-all duration-500 hover:from-amber-600 hover:to-amber-400 cursor-pointer relative group"
                                                style={{ height: `${Math.max(height, 8)}%` }}
                                                title={`${item.name}: ${item.count} ${analyticsType === "sales" ? "vendas" : "visualizacoes"}`}
                                            >
                                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-10 pointer-events-none">
                                                    {item.name}
                                                </div>
                                            </div>
                                            <span className="text-xs text-gray-500 font-medium">
                                                #{getRank(index)}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="mt-2 flex justify-between text-xs text-gray-400">
                                <span>{analyticsType === "sales" ? "Mais vendido" : "Mais acessado"} desta pagina</span>
                                <span>Mostrando {data.length} de {pagination.total} produtos</span>
                            </div>
                        </div>

                        {pagination.totalPages > 1 && (
                            <div className="p-4 border-t border-gray-100 flex items-center justify-between">
                                <p className="text-sm text-gray-500">
                                    Pagina {pagination.page} de {pagination.totalPages}
                                </p>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={handlePrevPage}
                                        disabled={pagination.page === 1}
                                        className="flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed bg-gray-100 hover:bg-gray-200 text-gray-700"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                        Anterior
                                    </button>
                                    <div className="flex items-center gap-1">
                                        {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => {
                                            let pageNum: number;
                                            if (pagination.totalPages <= 5) {
                                                pageNum = i + 1;
                                            } else if (pagination.page <= 3) {
                                                pageNum = i + 1;
                                            } else if (pagination.page >= pagination.totalPages - 2) {
                                                pageNum = pagination.totalPages - 4 + i;
                                            } else {
                                                pageNum = pagination.page - 2 + i;
                                            }
                                            return (
                                                <button
                                                    key={pageNum}
                                                    onClick={() => setPagination((prev) => ({ ...prev, page: pageNum }))}
                                                    className={`w-8 h-8 text-sm font-medium rounded-lg transition ${
                                                        pagination.page === pageNum
                                                            ? "bg-amber-600 text-white"
                                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                    }`}
                                                >
                                                    {pageNum}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <button
                                        onClick={handleNextPage}
                                        disabled={pagination.page === pagination.totalPages}
                                        className="flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed bg-gray-100 hover:bg-gray-200 text-gray-700"
                                    >
                                        Proximo
                                        <ChevronRight className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {showSeedModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">Gerar Dados de Teste</h3>
                            <button
                                onClick={() => setShowSeedModal(false)}
                                className="p-1 hover:bg-gray-100 rounded-lg"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">
                            Defina a quantidade de vendas e acessos que serao distribuidos aleatoriamente entre os produtos.
                        </p>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Quantidade de Vendas
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="1000"
                                    value={seedSalesCount}
                                    onChange={(e) => setSeedSalesCount(Math.max(1, parseInt(e.target.value) || 1))}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Quantidade de Acessos
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="5000"
                                    value={seedViewsCount}
                                    onChange={(e) => setSeedViewsCount(Math.max(1, parseInt(e.target.value) || 1))}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500"
                                />
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setShowSeedModal(false)}
                                className="flex-1 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSeedData}
                                className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition"
                            >
                                Gerar Dados
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
