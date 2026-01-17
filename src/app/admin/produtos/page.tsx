"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, Search, X, Check } from "lucide-react";
import MultiImageUploader from "@/components/admin/MultiImageUploader";

interface Product {
    id: string;
    name: string;
    slug: string;
    price: number;
    comparePrice: number | null;
    stock: number;
    isNew: boolean;
    isFeatured: boolean;
    images: string[];
    colors: { name: string; hex: string }[];
    shippingOptions: string[];
    category: {
        name: string;
    };
}

interface Category {
    id: string;
    name: string;
    slug: string;
}

const AVAILABLE_COLORS = [
    { name: "Preto", hex: "#000000" },
    { name: "Branco", hex: "#FFFFFF" },
    { name: "Vermelho", hex: "#E53935" },
    { name: "Rosa", hex: "#E91E63" },
    { name: "Pink", hex: "#FF4081" },
    { name: "Roxo", hex: "#9C27B0" },
    { name: "Azul", hex: "#1E88E5" },
    { name: "Azul Marinho", hex: "#1A237E" },
    { name: "Azul Claro", hex: "#4FC3F7" },
    { name: "Verde", hex: "#43A047" },
    { name: "Verde Agua", hex: "#4DB6AC" },
    { name: "Amarelo", hex: "#FDD835" },
    { name: "Laranja", hex: "#FB8C00" },
    { name: "Coral", hex: "#FF7043" },
    { name: "Bege", hex: "#D7CCC8" },
    { name: "Marrom", hex: "#795548" },
    { name: "Dourado", hex: "#FFD700" },
    { name: "Prata", hex: "#C0C0C0" },
    { name: "Estampado", hex: "linear-gradient(45deg, #E91E63, #4FC3F7, #FDD835)" },
    { name: "Cor Unica", hex: "#9E9E9E" },
];

const SHIPPING_OPTIONS = [
    { value: "envio", label: "Envio (Entrega)" },
    { value: "retirada", label: "Retirar na Loja" },
];

export default function AdminProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        description: "",
        price: "",
        comparePrice: "",
        categoryId: "",
        images: "",
        sizes: "P, M, G, GG",
        colors: [] as { name: string; hex: string }[],
        shippingOptions: ["envio", "retirada"] as string[],
        stock: "10",
        weight: "150",
        isNew: false,
        isFeatured: false,
    });

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    async function fetchProducts() {
        try {
            const res = await fetch("/api/admin/products");
            if (res.ok) {
                const data = await res.json();
                setProducts(data);
                setError(null);
            } else if (res.status === 401) {
                setError("Voce precisa estar logado para acessar esta pagina.");
            } else if (res.status === 403) {
                setError("Voce nao tem permissao para acessar esta pagina.");
            } else {
                setError("Erro ao carregar produtos.");
            }
        } catch (error) {
            console.error("Failed to fetch products:", error);
            setError("Erro de conexao. Tente novamente.");
        } finally {
            setLoading(false);
        }
    }

    async function fetchCategories() {
        try {
            const res = await fetch("/api/admin/categories");
            if (res.ok) {
                const data = await res.json();
                setCategories(data);
            }
        } catch (error) {
            console.error("Failed to fetch categories:", error);
        }
    }

    const formatPrice = (value: number) => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(value / 100);
    };

    const toggleColor = (color: { name: string; hex: string }) => {
        setFormData((prev) => {
            const exists = prev.colors.find((c) => c.name === color.name);
            if (exists) {
                return { ...prev, colors: prev.colors.filter((c) => c.name !== color.name) };
            }
            return { ...prev, colors: [...prev.colors, color] };
        });
    };

    const toggleShipping = (option: string) => {
        setFormData((prev) => {
            const exists = prev.shippingOptions.includes(option);
            if (exists) {
                return { ...prev, shippingOptions: prev.shippingOptions.filter((o) => o !== option) };
            }
            return { ...prev, shippingOptions: [...prev.shippingOptions, option] };
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            name: formData.name,
            slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, "-"),
            description: formData.description,
            price: Math.round(parseFloat(formData.price) * 100),
            comparePrice: formData.comparePrice
                ? Math.round(parseFloat(formData.comparePrice) * 100)
                : null,
            categoryId: formData.categoryId,
            images: formData.images.split(",").map((url) => url.trim()).filter(Boolean),
            sizes: formData.sizes.split(",").map((s) => s.trim()),
            colors: formData.colors,
            shippingOptions: formData.shippingOptions,
            stock: parseInt(formData.stock),
            weight: parseInt(formData.weight),
            isNew: formData.isNew,
            isFeatured: formData.isFeatured,
        };

        try {
            const url = editingProduct
                ? `/api/admin/products/${editingProduct.id}`
                : "/api/admin/products";
            const method = editingProduct ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                fetchProducts();
                setShowModal(false);
                resetForm();
            } else {
                const error = await res.json();
                alert(error.message || "Erro ao salvar produto");
            }
        } catch (error) {
            console.error("Failed to save product:", error);
            alert("Erro ao salvar produto");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Tem certeza que deseja excluir este produto?")) return;

        try {
            const res = await fetch(`/api/admin/products/${id}`, {
                method: "DELETE",
            });
            if (res.ok) {
                fetchProducts();
            }
        } catch (error) {
            console.error("Failed to delete product:", error);
        }
    };

    const parseColors = (colors: unknown): { name: string; hex: string }[] => {
        if (Array.isArray(colors)) return colors;
        if (typeof colors === "string") {
            try {
                const parsed = JSON.parse(colors);
                return Array.isArray(parsed) ? parsed : [];
            } catch {
                return [];
            }
        }
        return [];
    };

    const parseShippingOptions = (options: unknown): string[] => {
        if (Array.isArray(options)) return options;
        if (typeof options === "string") {
            try {
                const parsed = JSON.parse(options);
                return Array.isArray(parsed) ? parsed : ["envio", "retirada"];
            } catch {
                return ["envio", "retirada"];
            }
        }
        return ["envio", "retirada"];
    };

    const openEditModal = (product: Product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            slug: product.slug,
            description: "",
            price: (product.price / 100).toString(),
            comparePrice: product.comparePrice
                ? (product.comparePrice / 100).toString()
                : "",
            categoryId: "",
            images: product.images.join(", "),
            sizes: "P, M, G, GG",
            colors: parseColors(product.colors),
            shippingOptions: parseShippingOptions(product.shippingOptions),
            stock: product.stock.toString(),
            weight: "150",
            isNew: product.isNew,
            isFeatured: product.isFeatured,
        });
        setShowModal(true);
    };

    const resetForm = () => {
        setEditingProduct(null);
        setFormData({
            name: "",
            slug: "",
            description: "",
            price: "",
            comparePrice: "",
            categoryId: "",
            images: "",
            sizes: "P, M, G, GG",
            colors: [],
            shippingOptions: ["envio", "retirada"],
            stock: "10",
            weight: "150",
            isNew: false,
            isFeatured: false,
        });
    };

    const filteredProducts = products.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Produtos</h1>
                <button
                    onClick={() => {
                        resetForm();
                        setShowModal(true);
                    }}
                    className="flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition"
                >
                    <Plus className="h-5 w-5" />
                    Novo Produto
                </button>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar produtos..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="p-8 text-center">
                        <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto" />
                    </div>
                ) : error ? (
                    <div className="p-8 text-center">
                        <p className="text-red-600 mb-4">{error}</p>
                        <a href="/sign-in" className="text-amber-600 hover:underline">
                            Fazer login
                        </a>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Produto
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Categoria
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Preco
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Estoque
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                    Acoes
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredProducts.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 relative">
                                                {product.images[0] && (
                                                    <Image
                                                        src={product.images[0]}
                                                        alt={product.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                )}
                                            </div>
                                            <span className="font-medium">
                                                {product.name}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">
                                        {product.category?.name}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div>
                                            <span className="font-medium">
                                                {formatPrice(product.price)}
                                            </span>
                                            {product.comparePrice && (
                                                <span className="ml-2 text-sm text-gray-400 line-through">
                                                    {formatPrice(product.comparePrice)}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`${
                                                product.stock > 0
                                                    ? "text-green-600"
                                                    : "text-red-600"
                                            }`}
                                        >
                                            {product.stock}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-1">
                                            {product.isNew && (
                                                <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">
                                                    Novo
                                                </span>
                                            )}
                                            {product.isFeatured && (
                                                <span className="px-2 py-1 text-xs bg-amber-100 text-amber-700 rounded">
                                                    Destaque
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => openEditModal(product)}
                                                className="p-2 hover:bg-gray-100 rounded-lg"
                                            >
                                                <Pencil className="h-4 w-4 text-gray-500" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                className="p-2 hover:bg-red-50 rounded-lg"
                                            >
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
                    <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b">
                            <h2 className="text-xl font-bold">
                                {editingProduct ? "Editar Produto" : "Novo Produto"}
                            </h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Nome
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) =>
                                            setFormData({ ...formData, name: e.target.value })
                                        }
                                        required
                                        className="w-full px-4 py-2 border rounded-lg"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Slug
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.slug}
                                        onChange={(e) =>
                                            setFormData({ ...formData, slug: e.target.value })
                                        }
                                        placeholder="gerado-automaticamente"
                                        className="w-full px-4 py-2 border rounded-lg"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Descricao
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({ ...formData, description: e.target.value })
                                    }
                                    rows={3}
                                    className="w-full px-4 py-2 border rounded-lg"
                                />
                            </div>

                            <div className="grid sm:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Preco (R$)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.price}
                                        onChange={(e) =>
                                            setFormData({ ...formData, price: e.target.value })
                                        }
                                        required
                                        className="w-full px-4 py-2 border rounded-lg"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Preco Anterior
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.comparePrice}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                comparePrice: e.target.value,
                                            })
                                        }
                                        className="w-full px-4 py-2 border rounded-lg"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Categoria
                                    </label>
                                    <select
                                        value={formData.categoryId}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                categoryId: e.target.value,
                                            })
                                        }
                                        required
                                        className="w-full px-4 py-2 border rounded-lg"
                                    >
                                        <option value="">Selecione</option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <MultiImageUploader
                                value={formData.images}
                                onChange={(images) =>
                                    setFormData({ ...formData, images })
                                }
                                label="Imagens do Produto"
                            />

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Cores Disponiveis
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {AVAILABLE_COLORS.map((color) => {
                                        const isSelected = formData.colors.some((c) => c.name === color.name);
                                        const isGradient = color.hex.includes("gradient");
                                        return (
                                            <button
                                                key={color.name}
                                                type="button"
                                                onClick={() => toggleColor(color)}
                                                className={`relative flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition ${
                                                    isSelected
                                                        ? "border-amber-500 bg-amber-50"
                                                        : "border-gray-200 hover:border-gray-300"
                                                }`}
                                                title={color.name}
                                            >
                                                <span
                                                    className="w-5 h-5 rounded-full border border-gray-300"
                                                    style={{
                                                        background: isGradient ? color.hex : color.hex,
                                                    }}
                                                />
                                                <span className="text-xs">{color.name}</span>
                                                {isSelected && (
                                                    <Check className="h-3 w-3 text-amber-600" />
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Opcoes de Frete
                                </label>
                                <div className="flex gap-4">
                                    {SHIPPING_OPTIONS.map((option) => {
                                        const isSelected = formData.shippingOptions.includes(option.value);
                                        return (
                                            <button
                                                key={option.value}
                                                type="button"
                                                onClick={() => toggleShipping(option.value)}
                                                className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition ${
                                                    isSelected
                                                        ? "border-amber-500 bg-amber-50"
                                                        : "border-gray-200 hover:border-gray-300"
                                                }`}
                                            >
                                                {isSelected && (
                                                    <Check className="h-4 w-4 text-amber-600" />
                                                )}
                                                <span className="text-sm">{option.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Tamanhos (separados por virgula)
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.sizes}
                                        onChange={(e) =>
                                            setFormData({ ...formData, sizes: e.target.value })
                                        }
                                        className="w-full px-4 py-2 border rounded-lg"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Estoque
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.stock}
                                        onChange={(e) =>
                                            setFormData({ ...formData, stock: e.target.value })
                                        }
                                        className="w-full px-4 py-2 border rounded-lg"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.isNew}
                                        onChange={(e) =>
                                            setFormData({ ...formData, isNew: e.target.checked })
                                        }
                                        className="w-4 h-4 text-amber-600"
                                    />
                                    <span>Produto Novo</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.isFeatured}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                isFeatured: e.target.checked,
                                            })
                                        }
                                        className="w-4 h-4 text-amber-600"
                                    />
                                    <span>Destaque</span>
                                </label>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
                                >
                                    {editingProduct ? "Salvar" : "Criar Produto"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
