"use client";

import { useState, useEffect } from "react";
import { ShoppingCart, Mail, Loader2 } from "lucide-react";

interface CartItem {
    quantity: number;
    product: {
        name: string;
        price: number;
    };
}

interface AbandonedCart {
    id: string;
    updatedAt: string;
    user: {
        name: string | null;
        email: string | null;
    };
    items: CartItem[];
}

export default function AbandonedCartsPage() {
    const [carts, setCarts] = useState<AbandonedCart[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCarts();
    }, []);

    async function fetchCarts() {
        try {
            const res = await fetch("/api/admin/analytics/abandoned-carts");
            if (res.ok) {
                const data = await res.json();
                setCarts(data);
            }
        } catch (error) {
            console.error("Failed to fetch abandoned carts:", error);
        } finally {
            setLoading(false);
        }
    }

    const calculateCartTotal = (items: CartItem[]) => {
        return items.reduce((total, item) => total + item.product.price * item.quantity, 0);
    };

    const formatPrice = (value: number) => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(value / 100);
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Carrinhos Abandonados</h1>
            <div className="bg-white rounded-xl border border-gray-200">
                {loading ? (
                    <div className="p-8 text-center"><Loader2 className="h-8 w-8 animate-spin mx-auto" /></div>
                ) : carts.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">Nenhum carrinho abandonado encontrado.</div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Itens</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Última Atualização</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {carts.map((cart) => (
                                <tr key={cart.id}>
                                    <td className="px-6 py-4">
                                        <div>{cart.user.name}</div>
                                        <div className="text-sm text-gray-500">{cart.user.email}</div>
                                    </td>
                                    <td className="px-6 py-4">{cart.items.length}</td>
                                    <td className="px-6 py-4">{formatPrice(calculateCartTotal(cart.items))}</td>
                                    <td className="px-6 py-4">{new Date(cart.updatedAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-right">
                                        <a href={`mailto:${cart.user.email}`} className="p-2 hover:bg-gray-100 rounded-lg">
                                            <Mail className="h-4 w-4 text-gray-500" />
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
