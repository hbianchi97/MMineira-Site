"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "./CartContext";

export function SideCart() {
    const {
        items,
        isOpen,
        itemCount,
        subtotal,
        removeItem,
        updateQuantity,
        closeCart,
    } = useCart();

    // Lock body scroll when cart is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    // Close on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") closeCart();
        };
        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [closeCart]);

    const formatPrice = (value: number) => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(value / 100);
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={closeCart}
                aria-hidden="true"
            />

            {/* Drawer */}
            <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-background shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-border px-6 py-4">
                    <div className="flex items-center gap-2">
                        <ShoppingBag className="h-5 w-5 text-primary" />
                        <h2 className="text-lg font-semibold">
                            Carrinho
                            {itemCount > 0 && (
                                <span className="ml-2 text-sm font-normal text-muted-foreground">
                                    ({itemCount} {itemCount === 1 ? "item" : "itens"})
                                </span>
                            )}
                        </h2>
                    </div>
                    <button
                        onClick={closeCart}
                        className="rounded-full p-2 transition-colors hover:bg-secondary"
                        aria-label="Fechar carrinho"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto px-6 py-4">
                    {items.length === 0 ? (
                        <div className="flex h-full flex-col items-center justify-center text-center">
                            <ShoppingBag className="mb-4 h-16 w-16 text-muted-foreground/30" />
                            <p className="mb-2 text-lg font-medium">
                                Seu carrinho está vazio
                            </p>
                            <p className="mb-6 text-sm text-muted-foreground">
                                Adicione produtos para continuar
                            </p>
                            <button
                                onClick={closeCart}
                                className="rounded-full bg-primary px-6 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                            >
                                Continuar Comprando
                            </button>
                        </div>
                    ) : (
                        <ul className="space-y-4">
                            {items.map((item) => (
                                <li
                                    key={item.id}
                                    className="flex gap-4 rounded-xl border border-border bg-card p-3"
                                >
                                    {/* Image */}
                                    <div className="relative h-24 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-secondary">
                                        <Image
                                            src={item.imageUrl}
                                            alt={item.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>

                                    {/* Info */}
                                    <div className="flex flex-1 flex-col">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <Link
                                                    href={`/produto/${item.slug}`}
                                                    onClick={closeCart}
                                                    className="text-sm font-medium hover:text-primary"
                                                >
                                                    {item.name}
                                                </Link>
                                                <p className="mt-0.5 text-xs text-muted-foreground">
                                                    Tamanho: {item.size}
                                                    {item.color && ` | Cor: ${item.color}`}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="text-muted-foreground transition-colors hover:text-destructive"
                                                aria-label="Remover item"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>

                                        <div className="mt-auto flex items-center justify-between pt-2">
                                            {/* Quantity */}
                                            <div className="inline-flex items-center rounded-lg border border-border">
                                                <button
                                                    onClick={() =>
                                                        updateQuantity(item.id, item.quantity - 1)
                                                    }
                                                    className="p-1.5 transition-colors hover:bg-secondary"
                                                    aria-label="Diminuir quantidade"
                                                >
                                                    <Minus className="h-3 w-3" />
                                                </button>
                                                <span className="min-w-[32px] text-center text-sm font-medium">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() =>
                                                        updateQuantity(item.id, item.quantity + 1)
                                                    }
                                                    className="p-1.5 transition-colors hover:bg-secondary"
                                                    aria-label="Aumentar quantidade"
                                                >
                                                    <Plus className="h-3 w-3" />
                                                </button>
                                            </div>

                                            {/* Price */}
                                            <span className="font-semibold">
                                                {formatPrice(item.price * item.quantity)}
                                            </span>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="border-t border-border px-6 py-4">
                        {/* Subtotal */}
                        <div className="mb-4 flex items-center justify-between">
                            <span className="text-muted-foreground">Subtotal</span>
                            <span className="text-xl font-bold">{formatPrice(subtotal)}</span>
                        </div>
                        <p className="mb-4 text-xs text-muted-foreground">
                            Frete e descontos calculados no checkout
                        </p>

                        {/* Checkout Button */}
                        <Link
                            href="/checkout"
                            onClick={closeCart}
                            className="flex w-full items-center justify-center gap-2 rounded-full gradient-gold py-4 text-base font-semibold text-white transition-transform hover:scale-[1.02]"
                        >
                            Finalizar Compra
                        </Link>
                        <button
                            onClick={closeCart}
                            className="mt-3 w-full text-center text-sm text-muted-foreground hover:text-foreground"
                        >
                            Continuar Comprando
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
