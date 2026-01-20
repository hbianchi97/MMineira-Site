"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ThumbsUp, ThumbsDown, Trash2 } from "lucide-react";

interface Review {
    id: string;
    rating: number;
    comment: string | null;
    imageUrl: string | null;
    isApproved: boolean;
    createdAt: string;
    user: { name: string | null };
    product: { name: string };
}

export default function AdminReviews() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchReviews();
    }, []);

    async function fetchReviews() {
        try {
            const res = await fetch("/api/admin/reviews");
            if (res.ok) {
                const data = await res.json();
                setReviews(data);
                setError(null);
            } else {
                setError("Erro ao carregar avaliações.");
            }
        } catch (error) {
            console.error("Failed to fetch reviews:", error);
            setError("Erro de conexão. Tente novamente.");
        } finally {
            setLoading(false);
        }
    }

    const handleApprove = async (id: string, isApproved: boolean) => {
        try {
            const res = await fetch(`/api/admin/reviews/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isApproved }),
            });
            if (res.ok) {
                fetchReviews();
            }
        } catch (error) {
            console.error("Failed to update review:", error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Tem certeza que deseja excluir esta avaliação?")) return;

        try {
            const res = await fetch(`/api/admin/reviews/${id}`, {
                method: "DELETE",
            });
            if (res.ok) {
                fetchReviews();
            }
        } catch (error) {
            console.error("Failed to delete review:", error);
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Gerenciar Avaliações</h1>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center"><div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto" /></div>
                ) : error ? (
                    <div className="p-8 text-center"><p className="text-red-600">{error}</p></div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produto</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avaliação</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {reviews.map((review) => (
                                <tr key={review.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium">{review.product.name}</td>
                                    <td className="px-6 py-4">{review.user.name || "Anônimo"}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            {[...Array(5)].map((_, i) => (
                                                <svg key={i} className={`w-4 h-4 ${i < review.rating ? "text-yellow-400" : "text-gray-300"}`} fill="currentColor" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" /></svg>
                                            ))}
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1">{review.comment}</p>
                                        {review.imageUrl && <Image src={review.imageUrl} alt="Review image" width={100} height={100} className="mt-2 rounded-lg" />}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs rounded ${review.isApproved ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                                            {review.isApproved ? "Aprovada" : "Pendente"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => handleApprove(review.id, !review.isApproved)} className="p-2 hover:bg-gray-100 rounded-lg">
                                                {review.isApproved ? <ThumbsDown className="h-4 w-4 text-gray-500" /> : <ThumbsUp className="h-4 w-4 text-green-500" />}
                                            </button>
                                            <button onClick={() => handleDelete(review.id)} className="p-2 hover:bg-red-50 rounded-lg">
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
        </div>
    );
}
