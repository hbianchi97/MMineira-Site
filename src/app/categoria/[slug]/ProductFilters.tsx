"use client";

import { useState, useMemo } from "react";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { ProductCard } from "@/components/shop/ProductCard";

interface ProductColor {
    name: string;
    hex: string;
}

interface Product {
    id: string;
    name: string;
    slug: string;
    price: number;
    comparePrice?: number;
    images: string[];
    isNew: boolean;
    isSoldOut: boolean;
    sizes: string[];
    colors: ProductColor[] | null;
}

interface ProductFiltersProps {
    products: Product[];
}

const sortOptions = [
    { value: "relevance", label: "Relevância" },
    { value: "price-asc", label: "Menor preço" },
    { value: "price-desc", label: "Maior preço" },
    { value: "newest", label: "Novidades" },
];

export function ProductFilters({ products }: ProductFiltersProps) {
    const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
    const [selectedColors, setSelectedColors] = useState<string[]>([]);
    const [sortBy, setSortBy] = useState("relevance");
    const [showFilters, setShowFilters] = useState(false);

    // Extract unique sizes and colors from products
    const allSizes = useMemo(() => {
        const sizes = new Set<string>();
        products.forEach((p) => p.sizes.forEach((s) => sizes.add(s)));
        return Array.from(sizes).sort((a, b) => {
            const order = ["PP", "P", "M", "G", "GG", "XG", "U"];
            return order.indexOf(a) - order.indexOf(b);
        });
    }, [products]);

    const allColors = useMemo(() => {
        const colors = new Map<string, string>();
        products.forEach((p) => {
            if (p.colors) {
                p.colors.forEach((c) => colors.set(c.name, c.hex));
            }
        });
        return Array.from(colors.entries()).map(([name, hex]) => ({ name, hex }));
    }, [products]);

    const filteredProducts = useMemo(() => {
        let result = [...products];

        if (selectedSizes.length > 0) {
            result = result.filter((p) =>
                p.sizes.some((s) => selectedSizes.includes(s))
            );
        }

        if (selectedColors.length > 0) {
            result = result.filter((p) =>
                p.colors?.some((c) => selectedColors.includes(c.name))
            );
        }

        switch (sortBy) {
            case "price-asc":
                result.sort((a, b) => a.price - b.price);
                break;
            case "price-desc":
                result.sort((a, b) => b.price - a.price);
                break;
            case "newest":
                result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
                break;
        }

        return result;
    }, [products, selectedSizes, selectedColors, sortBy]);

    const toggleSize = (size: string) => {
        setSelectedSizes((prev) =>
            prev.includes(size)
                ? prev.filter((s) => s !== size)
                : [...prev, size]
        );
    };

    const toggleColor = (color: string) => {
        setSelectedColors((prev) =>
            prev.includes(color)
                ? prev.filter((c) => c !== color)
                : [...prev, color]
        );
    };

    const clearFilters = () => {
        setSelectedSizes([]);
        setSelectedColors([]);
    };

    const hasActiveFilters = selectedSizes.length > 0 || selectedColors.length > 0;

    return (
        <section className="py-8 sm:py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Toolbar */}
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary"
                        >
                            <SlidersHorizontal className="h-4 w-4" />
                            Filtros
                            {hasActiveFilters && (
                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                                    {selectedSizes.length + selectedColors.length}
                                </span>
                            )}
                        </button>
                        {hasActiveFilters && (
                            <button
                                onClick={clearFilters}
                                className="text-sm text-muted-foreground hover:text-foreground"
                            >
                                Limpar filtros
                            </button>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                            {filteredProducts.length} produtos
                        </span>
                        <div className="relative">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="appearance-none rounded-lg border border-border bg-background py-2 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                            >
                                {sortOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        </div>
                    </div>
                </div>

                {/* Filter Panel */}
                {showFilters && (
                    <div className="mb-8 rounded-xl border border-border bg-card p-6">
                        <div className="flex items-center justify-between pb-4">
                            <h3 className="font-semibold">Filtrar por</h3>
                            <button
                                onClick={() => setShowFilters(false)}
                                className="text-muted-foreground hover:text-foreground"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="grid gap-6 sm:grid-cols-2">
                            {/* Size Filter */}
                            {allSizes.length > 0 && (
                                <div>
                                    <h4 className="mb-3 text-sm font-medium text-muted-foreground">
                                        Tamanho
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {allSizes.map((size) => (
                                            <button
                                                key={size}
                                                onClick={() => toggleSize(size)}
                                                className={`min-w-[48px] rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${selectedSizes.includes(size)
                                                        ? "border-primary bg-primary text-primary-foreground"
                                                        : "border-border hover:border-primary hover:bg-primary/5"
                                                    }`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Color Filter */}
                            {allColors.length > 0 && (
                                <div>
                                    <h4 className="mb-3 text-sm font-medium text-muted-foreground">
                                        Cor
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {allColors.map((color) => (
                                            <button
                                                key={color.name}
                                                onClick={() => toggleColor(color.name)}
                                                className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${selectedColors.includes(color.name)
                                                        ? "border-primary bg-primary text-primary-foreground"
                                                        : "border-border hover:border-primary hover:bg-primary/5"
                                                    }`}
                                            >
                                                {color.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Products Grid */}
                {filteredProducts.length > 0 ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {filteredProducts.map((product) => (
                            <ProductCard
                                key={product.id}
                                id={product.id}
                                name={product.name}
                                slug={product.slug}
                                price={product.price}
                                comparePrice={product.comparePrice}
                                images={product.images}
                                isNew={product.isNew}
                                isSoldOut={product.isSoldOut}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <p className="mb-2 text-lg font-medium">
                            Nenhum produto encontrado
                        </p>
                        <p className="text-muted-foreground">
                            Tente ajustar os filtros para ver mais resultados
                        </p>
                        <button
                            onClick={clearFilters}
                            className="mt-4 text-primary hover:underline"
                        >
                            Limpar todos os filtros
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}
