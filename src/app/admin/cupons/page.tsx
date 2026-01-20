"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { CouponType } from "@prisma/client";

interface Coupon {
    id: string;
    code: string;
    discountType: CouponType;
    discountValue: number;
    expiresAt: string | null;
    isActive: boolean;
    maxUses: number | null;
    uses: number;
    minPurchaseValue: number | null;
}

export default function AdminCoupons() {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const [formData, setFormData] = useState({
        code: "",
        discountType: "PERCENTAGE" as CouponType,
        discountValue: "",
        expiresAt: "",
        isActive: true,
        maxUses: "",
        minPurchaseValue: "",
    });

    useEffect(() => {
        fetchCoupons();
    }, []);

    async function fetchCoupons() {
        try {
            const res = await fetch("/api/admin/coupons");
            if (res.ok) {
                const data = await res.json();
                setCoupons(data);
                setError(null);
            } else {
                setError("Erro ao carregar cupons.");
            }
        } catch (error) {
            console.error("Failed to fetch coupons:", error);
            setError("Erro de conexão. Tente novamente.");
        } finally {
            setLoading(false);
        }
    }

    const formatValue = (type: CouponType, value: number) => {
        if (type === "PERCENTAGE") {
            return `${value}%`;
        }
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(value / 100);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            ...formData,
            discountValue: parseInt(formData.discountValue),
            maxUses: formData.maxUses ? parseInt(formData.maxUses) : null,
            minPurchaseValue: formData.minPurchaseValue ? Math.round(parseFloat(formData.minPurchaseValue) * 100) : null,
            expiresAt: formData.expiresAt ? new Date(formData.expiresAt).toISOString() : null,
        };

        try {
            const url = editingCoupon
                ? `/api/admin/coupons/${editingCoupon.id}`
                : "/api/admin/coupons";
            const method = editingCoupon ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                fetchCoupons();
                setShowModal(false);
                resetForm();
            } else {
                const error = await res.json();
                alert(error.message || "Erro ao salvar cupom");
            }
        } catch (error) {
            console.error("Failed to save coupon:", error);
            alert("Erro ao salvar cupom");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Tem certeza que deseja excluir este cupom?")) return;

        try {
            const res = await fetch(`/api/admin/coupons/${id}`, {
                method: "DELETE",
            });
            if (res.ok) {
                fetchCoupons();
            }
        } catch (error) {
            console.error("Failed to delete coupon:", error);
        }
    };
    
    const openEditModal = (coupon: Coupon) => {
        setEditingCoupon(coupon);
        setFormData({
            code: coupon.code,
            discountType: coupon.discountType,
            discountValue: coupon.discountValue.toString(),
            expiresAt: coupon.expiresAt ? coupon.expiresAt.substring(0, 10) : "",
            isActive: coupon.isActive,
            maxUses: coupon.maxUses?.toString() || "",
            minPurchaseValue: coupon.minPurchaseValue ? (coupon.minPurchaseValue / 100).toString() : "",
        });
        setShowModal(true);
    };

    const resetForm = () => {
        setEditingCoupon(null);
        setFormData({
            code: "",
            discountType: "PERCENTAGE",
            discountValue: "",
            expiresAt: "",
            isActive: true,
            maxUses: "",
            minPurchaseValue: "",
        });
    };

    const filteredCoupons = coupons.filter((c) =>
        c.code.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Cupons de Desconto</h1>
                <button
                    onClick={() => {
                        resetForm();
                        setShowModal(true);
                    }}
                    className="flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition"
                >
                    <Plus className="h-5 w-5" />
                    Novo Cupom
                </button>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar por código..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="p-8 text-center"><div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto" /></div>
                ) : error ? (
                    <div className="p-8 text-center"><p className="text-red-600">{error}</p></div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Código</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usos</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expira em</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredCoupons.map((coupon) => (
                                <tr key={coupon.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium">{coupon.code}</td>
                                    <td className="px-6 py-4 text-gray-500">{coupon.discountType}</td>
                                    <td className="px-6 py-4">{formatValue(coupon.discountType, coupon.discountValue)}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs rounded ${coupon.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                            {coupon.isActive ? "Ativo" : "Inativo"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">{coupon.uses}{coupon.maxUses ? ` / ${coupon.maxUses}`: ''}</td>
                                    <td className="px-6 py-4 text-gray-500">{coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleDateString() : "-"}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => openEditModal(coupon)} className="p-2 hover:bg-gray-100 rounded-lg">
                                                <Pencil className="h-4 w-4 text-gray-500" />
                                            </button>
                                            <button onClick={() => handleDelete(coupon.id)} className="p-2 hover:bg-red-50 rounded-lg">
                                                <Trash2 className="h-4 w-4 text-red-500" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {showModal && (
                 <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b">
                            <h2 className="text-xl font-bold">{editingCoupon ? "Editar Cupom" : "Novo Cupom"}</h2>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">X</button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Código</label>
                                <input type="text" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })} required className="w-full px-4 py-2 border rounded-lg" />
                            </div>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Tipo de Desconto</label>
                                    <select value={formData.discountType} onChange={(e) => setFormData({ ...formData, discountType: e.target.value as CouponType })} className="w-full px-4 py-2 border rounded-lg">
                                        <option value="PERCENTAGE">Porcentagem (%)</option>
                                        <option value="FIXED">Valor Fixo (R$)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Valor do Desconto</label>
                                    <input type="number" value={formData.discountValue} onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })} required className="w-full px-4 py-2 border rounded-lg" />
                                </div>
                            </div>
                             <div>
                                <label className="block text-sm font-medium mb-1">Valor Mínimo da Compra (R$)</label>
                                <input type="number" step="0.01" value={formData.minPurchaseValue} onChange={(e) => setFormData({ ...formData, minPurchaseValue: e.target.value })} placeholder="Opcional" className="w-full px-4 py-2 border rounded-lg" />
                            </div>
                             <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Usos Máximos</label>
                                    <input type="number" value={formData.maxUses} onChange={(e) => setFormData({ ...formData, maxUses: e.target.value })} placeholder="Ilimitado" className="w-full px-4 py-2 border rounded-lg" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Data de Expiração</label>
                                    <input type="date" value={formData.expiresAt} onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })} className="w-full px-4 py-2 border rounded-lg" />
                                </div>
                            </div>
                             <div className="flex items-center gap-2">
                                <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} id="isActive" className="w-4 h-4 text-amber-600"/>
                                <label htmlFor="isActive">Ativo</label>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">Cancelar</button>
                                <button type="submit" className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700">{editingCoupon ? "Salvar" : "Criar Cupom"}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
