import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/shop/ProductCard";
import {
    getCategoryBySlug,
    getProductsByCategory,
    parseProductImages,
    parseProductColors,
} from "@/lib/shop-data";
import { ProductFilters } from "./ProductFilters";

interface CategoryPageProps {
    params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
    const { slug } = await params;
    const [category, products] = await Promise.all([
        getCategoryBySlug(slug),
        getProductsByCategory(slug),
    ]);

    if (!category) {
        notFound();
    }

    // Transform products for the client component
    const productsForClient = products.map((product) => {
        const parsedColors = parseProductColors(product.colors);
        return {
            id: product.id,
            name: product.name,
            slug: product.slug,
            price: product.price,
            comparePrice: product.comparePrice ?? undefined,
            images: parseProductImages(product.images),
            isNew: product.isNew,
            isSoldOut: product.stock === 0,
            sizes: product.sizes,
            colors: parsedColors.length > 0 ? parsedColors : null,
        };
    });

    return (
        <div className="flex min-h-screen flex-col">
            <Header />

            <main className="flex-1">
                {/* Hero Banner */}
                <section className="relative h-[300px] overflow-hidden sm:h-[400px]">
                    <Image
                        src={category.imageUrl || "https://images.unsplash.com/photo-1520013817300-1f4c1cb245ef?w=1200&q=80"}
                        alt={category.name}
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-12">
                        <div className="mx-auto max-w-7xl">
                            <Link
                                href="/"
                                className="mb-4 inline-flex items-center gap-1 text-sm text-white/80 hover:text-white"
                            >
                                <ChevronLeft className="h-4 w-4" />
                                Voltar
                            </Link>
                            <h1 className="text-3xl font-bold text-white sm:text-5xl">
                                {category.name}
                            </h1>
                            <p className="mt-2 max-w-xl text-white/80">
                                {category.description}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Products with Filters */}
                <ProductFilters products={productsForClient} />
            </main>

            <Footer />
        </div>
    );
}
