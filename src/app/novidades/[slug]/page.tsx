import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, Calendar } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getPostBySlug } from "@/lib/shop-data";

interface PostPageProps {
    params: Promise<{ slug: string }>;
}

export default async function PostPage({ params }: PostPageProps) {
    const { slug } = await params;
    const post = await getPostBySlug(slug);

    if (!post || !post.isPublished) {
        notFound();
    }

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
                {post.imageUrl && (
                    <section className="relative h-[300px] overflow-hidden sm:h-[400px]">
                        <Image
                            src={post.imageUrl}
                            alt={post.title}
                            fill
                            sizes="100vw"
                            className="object-cover"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </section>
                )}

                <article className="py-12 sm:py-16">
                    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between mb-8">
                            <Link
                                href="/novidades"
                                className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                            >
                                <ChevronLeft className="h-4 w-4" />
                                Voltar para novidades
                            </Link>
                            {post.publishedAt && (
                                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                    <Calendar className="h-4 w-4" />
                                    {formatDate(post.publishedAt)}
                                </div>
                            )}
                        </div>

                        <div className={post.imageUrl ? "-mt-16 relative z-10" : ""}>
                            <div className="bg-card rounded-2xl p-6 sm:p-10 shadow-lg border border-border">

                                <h1 className="text-2xl sm:text-4xl font-bold text-foreground mb-6 mt-2">
                                    {post.title}
                                </h1>

                                {post.excerpt && (
                                    <p className="text-lg text-muted-foreground mb-8 border-l-4 border-primary pl-4">
                                        {post.excerpt}
                                    </p>
                                )}

                                {post.content && (
                                    <div className="prose prose-lg max-w-none text-foreground">
                                        {post.content.split("\n").map((paragraph, index) => (
                                            paragraph.trim() ? (
                                                <p key={index} className="mb-4">
                                                    {paragraph}
                                                </p>
                                            ) : null
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mt-12 text-center">
                            <Link
                                href="/categoria/biquinis"
                                className="inline-flex items-center gap-2 rounded-full gradient-gold px-6 py-3 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-105"
                            >
                                Ver nossa colecao
                            </Link>
                        </div>
                    </div>
                </article>
            </main>

            <Footer />
        </div>
    );
}
