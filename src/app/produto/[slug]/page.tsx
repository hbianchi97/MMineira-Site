import { notFound } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/shop/ProductCard";
import {
    getProductBySlug,
    getRelatedProducts,
    parseProductImages,
    parseProductColors,
} from "@/lib/shop-data";
import { ProductDetails } from "./ProductDetails";

interface ProductPageProps {
    params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { slug } = await params;
    const product = await getProductBySlug(slug);

    if (!product) {
        notFound();
    }

    const relatedProducts = await getRelatedProducts(
        product.id,
        product.categoryId,
        4
    );

    const images = parseProductImages(product.images);
    const colors = parseProductColors(product.colors);

    // Transform for client component
    const productForClient = {
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description || "",
        price: product.price,
        comparePrice: product.comparePrice ?? undefined,
        images,
        sizes: product.sizes,
        colors,
        category: product.category.name,
        categorySlug: product.category.slug,
        stock: product.stock,
        isNew: product.isNew,
    };

    const relatedForClient = relatedProducts.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: p.price,
        comparePrice: p.comparePrice ?? undefined,
        images: parseProductImages(p.images),
        isNew: p.isNew,
        isSoldOut: p.stock === 0,
    }));

    return (
        <div className="flex min-h-screen flex-col">
            <Header />

            <main className="flex-1">
                {/* Breadcrumb */}
                <div className="border-b border-border">
                    <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
                        <nav className="flex items-center gap-2 text-sm">
                            <Link href="/" className="text-muted-foreground hover:text-foreground">
                                Início
                            </Link>
                            <span className="text-muted-foreground">/</span>
                            <Link
                                href={`/categoria/${productForClient.categorySlug}`}
                                className="text-muted-foreground hover:text-foreground"
                            >
                                {productForClient.category}
                            </Link>
                            <span className="text-muted-foreground">/</span>
                            <span className="font-medium">{product.name}</span>
                        </nav>
                    </div>
                </div>

                {/* Product Details (Client Component) */}
                <ProductDetails product={productForClient} />

                {/* Related Products */}
                {relatedForClient.length > 0 && (
                    <section className="border-t border-border bg-secondary/30 py-12 sm:py-16">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <h2 className="mb-8 text-2xl font-bold">
                                Você também pode gostar
                            </h2>
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                                {relatedForClient.map((p) => (
                                    <ProductCard key={p.id} {...p} />
                                ))}
                            </div>
                        </div>
                    </section>
                )}
            </main>

            <Footer />
        </div>
    );
}
