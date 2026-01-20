"use client";

import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Loader2 } from "lucide-react";

interface SalesData {
    date: string;
    total: number;
}

export function SalesChart() {
    const [data, setData] = useState<SalesData[]>([]);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState("30d");

    useEffect(() => {
        fetchSales();
    }, [period]);

    async function fetchSales() {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/analytics/sales?period=${period}`);
            if (res.ok) {
                const sales = await res.json();
                setData(sales);
            }
        } catch (error) {
            console.error("Failed to fetch sales data:", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Faturamento por Período</h2>
                <div className="flex gap-2">
                    <button onClick={() => setPeriod("7d")} className={`px-3 py-1 rounded-lg text-sm ${period === '7d' ? 'bg-amber-600 text-white' : 'bg-gray-200'}`}>7d</button>
                    <button onClick={() => setPeriod("30d")} className={`px-3 py-1 rounded-lg text-sm ${period === '30d' ? 'bg-amber-600 text-white' : 'bg-gray-200'}`}>30d</button>
                    <button onClick={() => setPeriod("90d")} className={`px-3 py-1 rounded-lg text-sm ${period === '90d' ? 'bg-amber-600 text-white' : 'bg-gray-200'}`}>90d</button>
                </div>
            </div>
            {loading ? (
                <div className="h-80 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
                </div>
            ) : (
                <ResponsiveContainer width="100%" height={320}>
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip formatter={(value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value as number)} />
                        <Legend />
                        <Bar dataKey="total" fill="#f59e0b" name="Faturamento" />
                    </BarChart>
                </ResponsiveContainer>
            )}
        </div>
    );
}
