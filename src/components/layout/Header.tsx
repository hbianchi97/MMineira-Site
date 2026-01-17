"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, ShoppingBag, Search, LogIn, UserPlus } from "lucide-react";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { site } from "@/lib/brand-config";
import { useCart } from "@/components/shop/CartContext";

const navigation = [
    { name: "Início", href: "/" },
    { name: "Biquínis", href: "/categoria/biquinis" },
    { name: "Maiôs", href: "/categoria/maios" },
    { name: "Saídas de Praia", href: "/categoria/saidas-de-praia" },
    { name: "Acessórios", href: "/categoria/acessorios" },
    { name: "Cangas", href: "/categoria/cangas" },
    { name: "Bolsas", href: "/categoria/bolsas" },
    { name: "Novidades", href: "/novidades" },
];

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { itemCount, openCart } = useCart();

    return (
        <header className="sticky top-0 z-50 glass">
            <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link href="/" className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-gradient-gold">
                                {site.shortName}
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex md:items-center md:gap-8">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex md:items-center md:gap-3">
                        <button
                            type="button"
                            className="rounded-full p-2 text-foreground/70 transition-colors hover:bg-secondary hover:text-foreground"
                            aria-label="Buscar"
                        >
                            <Search className="h-5 w-5" />
                        </button>
                        
                        <SignedOut>
                            <Link
                                href="/sign-in"
                                className="flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-secondary hover:text-foreground"
                            >
                                <LogIn className="h-4 w-4" />
                                Entrar
                            </Link>
                            <Link
                                href="/sign-up"
                                className="flex items-center gap-1.5 rounded-full gradient-gold px-4 py-2 text-sm font-semibold text-white shadow-sm transition-transform hover:scale-105"
                            >
                                <UserPlus className="h-4 w-4" />
                                Registrar
                            </Link>
                        </SignedOut>
                        
                        <SignedIn>
                            <UserButton 
                                afterSignOutUrl="/"
                                appearance={{
                                    elements: {
                                        avatarBox: "h-9 w-9"
                                    }
                                }}
                            />
                        </SignedIn>
                        
                        <button
                            type="button"
                            onClick={openCart}
                            className="relative rounded-full p-2 text-foreground/70 transition-colors hover:bg-secondary hover:text-foreground"
                            aria-label="Carrinho"
                        >
                            <ShoppingBag className="h-5 w-5" />
                            {itemCount > 0 && (
                                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                                    {itemCount}
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center gap-4 md:hidden">
                        <button
                            type="button"
                            onClick={openCart}
                            className="relative rounded-full p-2 text-foreground/70"
                            aria-label="Carrinho"
                        >
                            <ShoppingBag className="h-5 w-5" />
                            {itemCount > 0 && (
                                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                                    {itemCount}
                                </span>
                            )}
                        </button>
                        <button
                            type="button"
                            className="rounded-lg p-2 text-foreground/70"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            aria-label="Menu"
                        >
                            {isMenuOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <div className="border-t border-border md:hidden">
                        <div className="space-y-1 px-2 pb-3 pt-2">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="block rounded-lg px-3 py-2 text-base font-medium text-foreground/80 transition-colors hover:bg-secondary hover:text-foreground"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {item.name}
                                </Link>
                            ))}
                            <div className="mt-4 border-t border-border px-3 pt-4">
                                <SignedOut>
                                    <div className="flex flex-col gap-2">
                                        <Link
                                            href="/sign-in"
                                            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-secondary"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            <LogIn className="h-5 w-5" />
                                            Entrar
                                        </Link>
                                        <Link
                                            href="/sign-up"
                                            className="flex items-center justify-center gap-2 rounded-lg gradient-gold px-3 py-2 text-sm font-semibold text-white"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            <UserPlus className="h-5 w-5" />
                                            Criar Conta
                                        </Link>
                                    </div>
                                </SignedOut>
                                <SignedIn>
                                    <div className="flex items-center gap-3">
                                        <UserButton 
                                            afterSignOutUrl="/"
                                            appearance={{
                                                elements: {
                                                    avatarBox: "h-9 w-9"
                                                }
                                            }}
                                        />
                                        <span className="text-sm font-medium text-foreground/80">Minha Conta</span>
                                    </div>
                                </SignedIn>
                            </div>
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
}
