"use client";

import { useState, useEffect } from "react";
import {
    Plus,
    Pencil,
    Trash2,
    Loader2,
    Eye,
    EyeOff,
    Star,
    X,
    Save,
    Image as ImageIcon,
} from "lucide-react";
import ImageUploader from "@/components/admin/ImageUploader";

interface Post {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string | null;
    imageUrl: string | null;
    isPublished: boolean;
    isFeatured: boolean;
    publishedAt: string | null;
    createdAt: string;
}

export default function AdminNovidades() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingPost, setEditingPost] = useState<Post | null>(null);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        title: "",
        excerpt: "",
        content: "",
        imageUrl: "",
        isPublished: false,
        isFeatured: false,
    });

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const res = await fetch("/api/admin/posts");
            if (res.ok) {
                const data = await res.json();
                setPosts(data);
            }
        } catch (error) {
            console.error("Error fetching posts:", error);
        } finally {
            setLoading(false);
        }
    };

    const openNewPost = () => {
        setEditingPost(null);
        setFormData({
            title: "",
            excerpt: "",
            content: "",
            imageUrl: "",
            isPublished: false,
            isFeatured: false,
        });
        setShowModal(true);
    };

    const openEditPost = (post: Post) => {
        setEditingPost(post);
        setFormData({
            title: post.title,
            excerpt: post.excerpt || "",
            content: post.content || "",
            imageUrl: post.imageUrl || "",
            isPublished: post.isPublished,
            isFeatured: post.isFeatured,
        });
        setShowModal(true);
    };

    const handleSave = async () => {
        if (!formData.title.trim()) return;

        setSaving(true);
        try {
            const url = editingPost
                ? `/api/admin/posts/${editingPost.id}`
                : "/api/admin/posts";
            const method = editingPost ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    slug: editingPost?.slug,
                }),
            });

            if (res.ok) {
                setShowModal(false);
                fetchPosts();
            }
        } catch (error) {
            console.error("Error saving post:", error);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Tem certeza que deseja excluir esta novidade?")) return;

        setDeleting(id);
        try {
            const res = await fetch(`/api/admin/posts/${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                setPosts((prev) => prev.filter((p) => p.id !== id));
            }
        } catch (error) {
            console.error("Error deleting post:", error);
        } finally {
            setDeleting(null);
        }
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Novidades</h1>
                <button
                    onClick={openNewPost}
                    className="flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition"
                >
                    <Plus className="h-5 w-5" />
                    Nova Postagem
                </button>
            </div>

            {posts.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                    <ImageIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Nenhuma novidade ainda
                    </h3>
                    <p className="text-gray-500 mb-6">
                        Crie sua primeira postagem para compartilhar novidades e promocoes.
                    </p>
                    <button
                        onClick={openNewPost}
                        className="inline-flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition"
                    >
                        <Plus className="h-5 w-5" />
                        Criar Primeira Postagem
                    </button>
                </div>
            ) : (
                <div className="grid gap-4">
                    {posts.map((post) => (
                        <div
                            key={post.id}
                            className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4"
                        >
                            {post.imageUrl ? (
                                <img
                                    src={post.imageUrl}
                                    alt={post.title}
                                    className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
                                />
                            ) : (
                                <div className="w-24 h-24 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                                    <ImageIcon className="h-8 w-8 text-gray-300" />
                                </div>
                            )}

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-semibold text-gray-900 truncate">
                                        {post.title}
                                    </h3>
                                    {post.isFeatured && (
                                        <Star className="h-4 w-4 text-amber-500 fill-amber-500 flex-shrink-0" />
                                    )}
                                </div>
                                {post.excerpt && (
                                    <p className="text-sm text-gray-500 line-clamp-2 mb-2">
                                        {post.excerpt}
                                    </p>
                                )}
                                <div className="flex items-center gap-3 text-xs text-gray-400">
                                    <span
                                        className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${
                                            post.isPublished
                                                ? "bg-green-100 text-green-700"
                                                : "bg-gray-100 text-gray-600"
                                        }`}
                                    >
                                        {post.isPublished ? (
                                            <Eye className="h-3 w-3" />
                                        ) : (
                                            <EyeOff className="h-3 w-3" />
                                        )}
                                        {post.isPublished ? "Publicado" : "Rascunho"}
                                    </span>
                                    <span>{formatDate(post.createdAt)}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 flex-shrink-0">
                                <button
                                    onClick={() => openEditPost(post)}
                                    className="p-2 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition"
                                >
                                    <Pencil className="h-5 w-5" />
                                </button>
                                <button
                                    onClick={() => handleDelete(post.id)}
                                    disabled={deleting === post.id}
                                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                                >
                                    {deleting === post.id ? (
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                    ) : (
                                        <Trash2 className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div
                        className="absolute inset-0 bg-black/50"
                        onClick={() => setShowModal(false)}
                    />
                    <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
                        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                            <h2 className="text-lg font-semibold">
                                {editingPost ? "Editar Postagem" : "Nova Postagem"}
                            </h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Titulo *
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            title: e.target.value,
                                        }))
                                    }
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500"
                                    placeholder="Titulo da novidade"
                                />
                            </div>

                            <ImageUploader
                                value={formData.imageUrl}
                                onChange={(url) =>
                                    setFormData((prev) => ({ ...prev, imageUrl: url }))
                                }
                                label="Imagem da Novidade"
                            />

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Resumo
                                </label>
                                <textarea
                                    value={formData.excerpt}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            excerpt: e.target.value,
                                        }))
                                    }
                                    rows={2}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 resize-none"
                                    placeholder="Breve descricao para exibir na listagem"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Conteudo
                                </label>
                                <textarea
                                    value={formData.content}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            content: e.target.value,
                                        }))
                                    }
                                    rows={6}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 resize-none"
                                    placeholder="Conteudo completo da postagem..."
                                />
                            </div>

                            <div className="flex items-center gap-6">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.isPublished}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                isPublished: e.target.checked,
                                            }))
                                        }
                                        className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500"
                                    />
                                    <span className="text-sm">Publicar</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.isFeatured}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                isFeatured: e.target.checked,
                                            }))
                                        }
                                        className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500"
                                    />
                                    <span className="text-sm">Destaque</span>
                                </label>
                            </div>
                        </div>

                        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-4 flex justify-end gap-3">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving || !formData.title.trim()}
                                className="flex items-center gap-2 bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition disabled:opacity-50"
                            >
                                {saving ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        Salvando...
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-5 w-5" />
                                        Salvar
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
