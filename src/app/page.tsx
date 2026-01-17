import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Truck, ShieldCheck, CreditCard } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/shop/ProductCard";
import {
    getCategories,
    getFeaturedProducts,
    parseProductImages,
    getSiteConfig,
} from "@/lib/shop-data";

const benefits = [
    {
        icon: Truck,
        title: "Frete Gratis",
        description: "Para compras acima de R$ 299",
    },
    {
        icon: ShieldCheck,
        title: "Compra Segura",
        description: "Seus dados protegidos",
    },
    {
        icon: CreditCard,
        title: "Parcelamento",
        description: "Em ate 6x sem juros",
    },
];

const defaultHomeConfig = {
    imageUrl: "https://images.unsplash.com/photo-1520013817300-1f4c1cb245ef?w=800&q=80",
    subtitle: "Nova Colecao 2026",
    title: "Moda Praia Exclusiva do Rio",
    description: "Descubra pecas unicas com estampas autorais. Biquinis, maios e saidas de praia que realcam sua beleza natural.",
};

export default async function Home() {
    const [categories, featuredProducts, homeConfig] = await Promise.all([
        getCategories(),
        getFeaturedProducts(4),
        getSiteConfig("home"),
    ]);

    const hero = {
        imageUrl: homeConfig?.imageUrl || defaultHomeConfig.imageUrl,
        subtitle: homeConfig?.subtitle || defaultHomeConfig.subtitle,
        title: homeConfig?.title || defaultHomeConfig.title,
        description: homeConfig?.description || defaultHomeConfig.description,
    };

    return (
        <div className="flex min-h-screen flex-col">
            <Header />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative overflow-hidden gradient-sunset">
                    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
                        <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
                            <div className="flex flex-col justify-center">
                                <span className="mb-4 inline-block w-fit rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                                    {hero.subtitle}
                                </span>
                                <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                                    {hero.title}
                                </h1>
                                <p className="mb-8 max-w-lg text-lg text-muted-foreground">
                                    {hero.description}
                                </p>
                                <div className="flex flex-wrap gap-4">
                                    <Link
                                        href="/categoria/biquinis"
                                        className="inline-flex items-center gap-2 rounded-full gradient-gold px-6 py-3 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-105"
                                    >
                                        Ver Novidades
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                    <Link
                                        href="/categoria/biquinis"
                                        className="inline-flex items-center gap-2 rounded-full border-2 border-primary bg-transparent px-6 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                                    >
                                        Explorar Colecao
                                    </Link>
                                </div>
                            </div>
                            <div className="relative">
                                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-2xl">
                                    <Image
                                        src={hero.imageUrl}
                                        alt="Menina Mineira - Moda Praia"
                                        fill
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        className="object-cover"
                                        priority
                                    />
                                </div>
                                <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-primary/20 blur-3xl" />
                                <div className="absolute -right-4 -top-4 h-32 w-32 rounded-full bg-accent/20 blur-3xl" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Benefits Bar */}
                <section className="border-y border-border bg-card">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        <div className="grid gap-6 sm:grid-cols-3">
                            {benefits.map((benefit) => (
                                <div
                                    key={benefit.title}
                                    className="flex items-center gap-4"
                                >
                                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                                        <benefit.icon className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground">
                                            {benefit.title}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            {benefit.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Categories */}
                <section className="py-16 sm:py-24">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-12 text-center">
                            <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
                                Explore por{" "}
                                <span className="text-gradient-gold">
                                    Categoria
                                </span>
                            </h2>
                            <p className="mx-auto max-w-2xl text-muted-foreground">
                                Encontre a peça perfeita para seu estilo.
                                Navegue por nossas categorias e descubra sua
                                próxima favorita.
                            </p>
                        </div>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {categories.map((category) => (
                                <Link
                                    key={category.id}
                                    href={`/categoria/${category.slug}`}
                                    className="group relative aspect-[4/5] overflow-hidden rounded-2xl hover-lift"
                                >
                                    <Image
                                        src={category.imageUrl || "https://images.unsplash.com/photo-1520013817300-1f4c1cb245ef?w=600&q=80"}
                                        alt={category.name}
                                        fill
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                                    <div className="absolute bottom-0 left-0 right-0 p-6">
                                        <h3 className="mb-1 text-2xl font-bold text-white">
                                            {category.name}
                                        </h3>
                                        <p className="text-sm text-white/80">
                                            {category.description}
                                        </p>
                                        <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-white group-hover:gap-2 transition-all">
                                            Ver produtos
                                            <ArrowRight className="h-4 w-4" />
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Featured Products */}
                <section className="bg-secondary/30 py-16 sm:py-24">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-12 flex items-end justify-between">
                            <div>
                                <h2 className="mb-2 text-3xl font-bold text-foreground sm:text-4xl">
                                    Produtos em{" "}
                                    <span className="text-gradient-gold">
                                        Destaque
                                    </span>
                                </h2>
                                <p className="text-muted-foreground">
                                    Os queridinhos da nossa loja
                                </p>
                            </div>
                            <Link
                                href="/categoria/biquinis"
                                className="hidden items-center gap-2 text-sm font-medium text-primary hover:underline sm:inline-flex"
                            >
                                Ver todos
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {featuredProducts.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    id={product.id}
                                    name={product.name}
                                    slug={product.slug}
                                    price={product.price}
                                    comparePrice={product.comparePrice ?? undefined}
                                    images={parseProductImages(product.images)}
                                    isNew={product.isNew}
                                    isSoldOut={product.stock === 0}
                                />
                            ))}
                        </div>
                        <div className="mt-8 text-center sm:hidden">
                            <Link
                                href="/categoria/biquinis"
                                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                            >
                                Ver todos os produtos
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Newsletter / CTA */}
                <section className="py-16 sm:py-24">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="overflow-hidden rounded-3xl gradient-gold p-8 sm:p-12 lg:p-16">
                            <div className="mx-auto max-w-2xl text-center">
                                <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
                                    Fique por dentro das novidades
                                </h2>
                                <p className="mb-8 text-white/90">
                                    Cadastre-se e receba ofertas exclusivas,
                                    lançamentos e dicas de moda direto no seu
                                    e-mail.
                                </p>
                                <form className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                                    <input
                                        type="email"
                                        placeholder="Seu melhor e-mail"
                                        className="rounded-full border-0 bg-white/20 px-6 py-3 text-white placeholder:text-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/50 sm:min-w-[300px]"
                                    />
                                    <button
                                        type="submit"
                                        className="rounded-full bg-white px-8 py-3 font-semibold text-primary transition-transform hover:scale-105"
                                    >
                                        Cadastrar
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
