import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, Calendar } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getPublishedPosts } from "@/lib/shop-data";

export default async function NovidadesPage() {
    const posts = await getPublishedPosts();

    const formatDate = (dateStr: string | Date | null) => {
        if (!dateStr) return "";
        return new Date(dateStr).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    };

    return (
        <div className="flex min-h-screen flex-col">
            <Header />

            <main className="flex-1">
                <section className="relative h-[250px] overflow-hidden sm:h-[300px] gradient-sunset">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center px-4">
                            <h1 className="text-3xl font-bold text-foreground sm:text-5xl">
                                Novidades
                            </h1>
                            <p className="mt-4 max-w-xl mx-auto text-muted-foreground">
                                Fique por dentro das ultimas noticias, lancamentos e promocoes da Menina Mineira
                            </p>
                        </div>
                    </div>
                </section>

                <section className="py-12 sm:py-16">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <Link
                            href="/"
                            className="mb-8 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Voltar para a loja
                        </Link>

                        {posts.length === 0 ? (
                            <div className="text-center py-16">
                                <p className="text-muted-foreground text-lg">
                                    Nenhuma novidade no momento. Volte em breve!
                                </p>
                            </div>
                        ) : (
                            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                                {posts.map((post) => (
                                    <Link
                                        key={post.id}
                                        href={`/novidades/${post.slug}`}
                                        className="group bg-card rounded-2xl overflow-hidden border border-border hover-lift"
                                    >
                                        <div className="relative aspect-[16/10] bg-secondary">
                                            {post.imageUrl ? (
                                                <Image
                                                    src={post.imageUrl}
                                                    alt={post.title}
                                                    fill
                                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <span className="text-4xl">📰</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-5">
                                            {post.publishedAt && (
                                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
                                                    <Calendar className="h-3.5 w-3.5" />
                                                    {formatDate(post.publishedAt)}
                                                </div>
                                            )}
                                            <h2 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-2">
                                                {post.title}
                                            </h2>
                                            {post.excerpt && (
                                                <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
                                                    {post.excerpt}
                                                </p>
                                            )}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
