"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";

interface Review {
    id: string;
    rating: number;
    comment: string | null;
    imageUrl: string | null;
    user: { name: string | null };
    createdAt: string;
}

interface ReviewsProps {
    productId: string;
}

export function Reviews({ productId }: ReviewsProps) {
    const { user } = useUser();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        rating: 5,
        comment: "",
        imageUrl: "",
    });

    useEffect(() => {
        fetchReviews();
    }, [productId]);

    async function fetchReviews() {
        try {
            const res = await fetch(`/api/products/${productId}/reviews`);
            if (res.ok) {
                const data = await res.json();
                setReviews(data);
            }
        } catch (error) {
            console.error("Failed to fetch reviews:", error);
        } finally {
            setLoading(false);
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch(`/api/products/${productId}/reviews`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                fetchReviews();
                setFormData({ rating: 5, comment: "", imageUrl: "" });
            }
        } catch (error) {
            console.error("Failed to submit review:", error);
        }
    };

    return (
        <section className="border-t border-border pt-8 mt-8">
            <h3 className="mb-4 text-lg font-semibold">Avaliações de Clientes</h3>
            {loading ? <p>Carregando avaliações...</p> : (
                <>
                    {reviews.map((review) => (
                        <div key={review.id} className="border-b border-border py-4">
                            <div className="flex items-center">
                                {[...Array(5)].map((_, i) => <svg key={i} className={`w-4 h-4 ${i < review.rating ? "text-yellow-400" : "text-gray-300"}`} fill="currentColor" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" /></svg>)}
                                <span className="ml-2 font-semibold">{review.user.name || "Anônimo"}</span>
                            </div>
                            <p className="mt-2 text-gray-600">{review.comment}</p>
                        </div>
                    ))}
                </>
            )}

            {user && (
                <form onSubmit={handleSubmit} className="mt-8">
                    <h4 className="font-semibold mb-2">Deixe sua avaliação</h4>
                    <div className="flex items-center mb-2">
                         {[...Array(5)].map((_, i) => (
                            <button type="button" key={i} onClick={() => setFormData({...formData, rating: i+1})}>
                                <svg className={`w-6 h-6 ${i < formData.rating ? "text-yellow-400" : "text-gray-300"}`} fill="currentColor" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" /></svg>
                            </button>
                        ))}
                    </div>
                    <textarea value={formData.comment} onChange={(e) => setFormData({...formData, comment: e.target.value})} rows={3} className="w-full p-2 border rounded-lg mb-2" placeholder="Seu comentário..."/>
                    {/* TODO: Image uploader */}
                    <button type="submit" className="px-4 py-2 bg-amber-600 text-white rounded-lg">Enviar Avaliação</button>
                </form>
            )}
        </section>
    );
}
