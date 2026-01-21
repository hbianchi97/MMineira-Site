"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { getImageUrl } from "@/lib/utils";

interface ProductCardProps {
    id: string;
    name: string;
    slug: string;
    price: number;
    comparePrice?: number;
    images: string[];
    isNew?: boolean;
    isSoldOut?: boolean;
}

export function ProductCard({
    id,
    name,
    slug,
    price,
    comparePrice,
    images,
    isNew,
    isSoldOut,
}: ProductCardProps) {
    const hasDiscount = comparePrice && comparePrice > price;
    const discountPercent = hasDiscount
        ? Math.round(((comparePrice - price) / comparePrice) * 100)
        : 0;

    const formatPrice = (value: number) => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(value / 100);
    };

    return (
        <article className="group relative">
            <Link href={`/produto/${slug}`} className="block">
                {/* Image Container */}
                <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-secondary">
                    {/* Primary Image */}
                    {images[0] ? (
                        <Image
                            src={getImageUrl(images[0])}
                            alt={name}
                            fill
                            className="object-cover transition-opacity duration-500 group-hover:opacity-0"
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center text-muted-foreground">
                            Sem imagem
                        </div>
                    )}

                    {/* Hover Image */}
                    {images[1] && (
                        <Image
                            src={getImageUrl(images[1])}
                            alt={`${name} - foto alternativa`}
                            fill
                            className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />
                    )}

                    {/* Badges */}
                    <div className="absolute left-2 top-2 flex flex-col gap-1">
                        {isNew && (
                            <span className="rounded-full bg-accent px-2 py-1 text-xs font-semibold text-accent-foreground">
                                Novo
                            </span>
                        )}
                        {hasDiscount && (
                            <span className="rounded-full bg-coral px-2 py-1 text-xs font-semibold text-white">
                                -{discountPercent}%
                            </span>
                        )}
                        {isSoldOut && (
                            <span className="rounded-full bg-foreground/80 px-2 py-1 text-xs font-semibold text-background">
                                Esgotado
                            </span>
                        )}
                        {!isSoldOut && price > 0 && (
                            <span className="rounded-full bg-amber-500/90 px-2 py-1 text-xs font-semibold text-white">
                                Últimas unidades
                            </span>
                        )}
                    </div>

                    {/* Quick Add Button */}
                    {!isSoldOut && (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                // TODO: Add to cart logic
                                console.log("Add to cart:", id);
                            }}
                            className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground opacity-0 shadow-lg transition-all hover:scale-110 group-hover:opacity-100"
                            aria-label="Adicionar ao carrinho"
                        >
                            <ShoppingBag className="h-5 w-5" />
                        </button>
                    )}
                </div>

                {/* Product Info */}
                <div className="mt-3 space-y-1">
                    <h3 className="text-sm font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                        {name}
                    </h3>
                    <div className="flex items-center gap-2">
                        <span className="text-base font-bold text-foreground">
                            {formatPrice(price)}
                        </span>
                        {hasDiscount && (
                            <span className="text-sm text-muted-foreground line-through">
                                {formatPrice(comparePrice)}
                            </span>
                        )}
                    </div>
                </div>
            </Link>
        </article>
    );
}
