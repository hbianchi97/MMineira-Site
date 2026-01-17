"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
    ChevronLeft,
    ChevronRight,
    Minus,
    Plus,
    ShoppingBag,
    Heart,
    Truck,
    Shield,
    RotateCcw,
    Check,
} from "lucide-react";
import { useCart } from "@/components/shop/CartContext";

interface ProductColor {
    name: string;
    hex: string;
}

interface ProductDetailsProps {
    product: {
        id: string;
        name: string;
        slug: string;
        description: string;
        price: number;
        comparePrice?: number;
        images: string[];
        sizes: string[];
        colors: ProductColor[];
        category: string;
        categorySlug: string;
        stock: number;
        isNew: boolean;
    };
}

const benefits = [
    { icon: Truck, text: "Frete grátis acima de R$ 299" },
    { icon: Shield, text: "Compra 100% segura" },
    { icon: RotateCcw, text: "Troca em até 30 dias" },
];

export function ProductDetails({ product }: ProductDetailsProps) {
    const { addItem } = useCart();
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [addedToCart, setAddedToCart] = useState(false);

    useEffect(() => {
        fetch(`/api/products/${product.slug}/view`, { method: "POST" }).catch(() => {});
    }, [product.slug]);

    const formatPrice = (value: number) => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(value / 100);
    };

    const handleAddToCart = () => {
        if (!selectedSize) {
            alert("Por favor, selecione um tamanho");
            return;
        }
        if (product.colors.length > 0 && !selectedColor) {
            alert("Por favor, selecione uma cor");
            return;
        }

        addItem({
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity,
            size: selectedSize,
            color: selectedColor || undefined,
            imageUrl: product.images[0] || "",
            slug: product.slug,
        });

        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2000);
    };

    const hasDiscount = product.comparePrice && product.comparePrice > product.price;
    const discountPercent = hasDiscount
        ? Math.round(((product.comparePrice! - product.price) / product.comparePrice!) * 100)
        : 0;

    return (
        <section className="py-8 sm:py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
                    {/* Image Gallery */}
                    <div className="space-y-4">
                        {/* Main Image */}
                        <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-secondary">
                            {product.images[selectedImage] ? (
                                <Image
                                    src={product.images[selectedImage]}
                                    alt={product.name}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            ) : (
                                <div className="flex h-full items-center justify-center text-muted-foreground">
                                    Sem imagem
                                </div>
                            )}
                            {product.isNew && (
                                <span className="absolute left-4 top-4 rounded-full bg-accent px-3 py-1 text-sm font-semibold text-accent-foreground">
                                    Novo
                                </span>
                            )}
                            {hasDiscount && (
                                <span className="absolute right-4 top-4 rounded-full bg-coral px-3 py-1 text-sm font-semibold text-white">
                                    -{discountPercent}%
                                </span>
                            )}

                            {/* Navigation Arrows */}
                            {product.images.length > 1 && (
                                <>
                                    <button
                                        onClick={() =>
                                            setSelectedImage((prev) =>
                                                prev > 0 ? prev - 1 : product.images.length - 1
                                            )
                                        }
                                        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-lg backdrop-blur-sm transition-colors hover:bg-white"
                                        aria-label="Imagem anterior"
                                    >
                                        <ChevronLeft className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() =>
                                            setSelectedImage((prev) =>
                                                prev < product.images.length - 1 ? prev + 1 : 0
                                            )
                                        }
                                        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-lg backdrop-blur-sm transition-colors hover:bg-white"
                                        aria-label="Próxima imagem"
                                    >
                                        <ChevronRight className="h-5 w-5" />
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Thumbnails */}
                        {product.images.length > 1 && (
                            <div className="flex gap-3 overflow-x-auto pb-2">
                                {product.images.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${selectedImage === index
                                                ? "border-primary"
                                                : "border-transparent hover:border-border"
                                            }`}
                                    >
                                        <Image
                                            src={image}
                                            alt={`${product.name} - Foto ${index + 1}`}
                                            fill
                                            className="object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-col">
                        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
                            {product.name}
                        </h1>

                        {/* Price */}
                        <div className="mt-4 flex items-baseline gap-3">
                            <span className="text-3xl font-bold text-foreground">
                                {formatPrice(product.price)}
                            </span>
                            {hasDiscount && (
                                <span className="text-lg text-muted-foreground line-through">
                                    {formatPrice(product.comparePrice!)}
                                </span>
                            )}
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                            ou 6x de {formatPrice(Math.ceil(product.price / 6))} sem juros
                        </p>

                        {/* Color Selection */}
                        {product.colors.length > 0 && (
                            <div className="mt-6">
                                <h3 className="mb-3 text-sm font-medium">
                                    Cor:{" "}
                                    <span className="text-muted-foreground">
                                        {selectedColor || "Selecione"}
                                    </span>
                                </h3>
                                <div className="flex gap-3">
                                    {product.colors.map((color) => (
                                        <button
                                            key={color.name}
                                            onClick={() => setSelectedColor(color.name)}
                                            className={`relative h-10 w-10 rounded-full border-2 transition-all ${selectedColor === color.name
                                                    ? "border-foreground ring-2 ring-foreground ring-offset-2"
                                                    : "border-border hover:border-foreground"
                                                }`}
                                            style={{ backgroundColor: color.hex }}
                                            title={color.name}
                                        >
                                            {selectedColor === color.name && (
                                                <Check className="absolute inset-0 m-auto h-5 w-5 text-white drop-shadow-md" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Size Selection */}
                        <div className="mt-6">
                            <div className="mb-3 flex items-center justify-between">
                                <h3 className="text-sm font-medium">
                                    Tamanho:{" "}
                                    <span className="text-muted-foreground">
                                        {selectedSize || "Selecione"}
                                    </span>
                                </h3>
                                <button className="text-sm text-primary hover:underline">
                                    Guia de tamanhos
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {product.sizes.map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`min-w-[56px] rounded-lg border px-4 py-3 text-sm font-medium transition-colors ${selectedSize === size
                                                ? "border-primary bg-primary text-primary-foreground"
                                                : "border-border hover:border-primary hover:bg-primary/5"
                                            }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Quantity */}
                        <div className="mt-6">
                            <h3 className="mb-3 text-sm font-medium">Quantidade</h3>
                            <div className="inline-flex items-center rounded-lg border border-border">
                                <button
                                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                    className="p-3 transition-colors hover:bg-secondary"
                                    aria-label="Diminuir quantidade"
                                >
                                    <Minus className="h-4 w-4" />
                                </button>
                                <span className="min-w-[48px] text-center font-medium">
                                    {quantity}
                                </span>
                                <button
                                    onClick={() =>
                                        setQuantity((q) => Math.min(product.stock, q + 1))
                                    }
                                    className="p-3 transition-colors hover:bg-secondary"
                                    aria-label="Aumentar quantidade"
                                >
                                    <Plus className="h-4 w-4" />
                                </button>
                            </div>
                            <span className="ml-4 text-sm text-muted-foreground">
                                {product.stock} disponíveis
                            </span>
                        </div>

                        {/* Add to Cart */}
                        <div className="mt-8 flex gap-4">
                            <button
                                onClick={handleAddToCart}
                                disabled={addedToCart || product.stock === 0}
                                className={`flex flex-1 items-center justify-center gap-2 rounded-full px-8 py-4 text-base font-semibold transition-all ${addedToCart
                                        ? "bg-palm text-white"
                                        : product.stock === 0
                                            ? "bg-muted text-muted-foreground cursor-not-allowed"
                                            : "gradient-gold text-white hover:scale-[1.02]"
                                    }`}
                            >
                                {addedToCart ? (
                                    <>
                                        <Check className="h-5 w-5" />
                                        Adicionado!
                                    </>
                                ) : product.stock === 0 ? (
                                    "Esgotado"
                                ) : (
                                    <>
                                        <ShoppingBag className="h-5 w-5" />
                                        Adicionar ao Carrinho
                                    </>
                                )}
                            </button>
                            <button
                                className="rounded-full border border-border p-4 transition-colors hover:bg-secondary"
                                aria-label="Adicionar aos favoritos"
                            >
                                <Heart className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Benefits */}
                        <div className="mt-8 space-y-3 border-t border-border pt-8">
                            {benefits.map((benefit) => (
                                <div key={benefit.text} className="flex items-center gap-3">
                                    <benefit.icon className="h-5 w-5 text-primary" />
                                    <span className="text-sm text-muted-foreground">
                                        {benefit.text}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Description */}
                        {product.description && (
                            <div className="mt-8 border-t border-border pt-8">
                                <h3 className="mb-4 text-lg font-semibold">Descrição</h3>
                                <div className="prose prose-sm text-muted-foreground">
                                    {product.description.split("\n").map((line, i) => (
                                        <p key={i} className="mb-2">
                                            {line}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
