import { db } from "@/lib/db";
import { Category, Product } from "@prisma/client";
import { unstable_cache } from "next/cache";

export type ProductWithCategory = Product & {
    category: Category;
};

export type ProductColor = {
    name: string;
    hex: string;
};

// Categories
export const getCategories = unstable_cache(
    async () => {
        return db.category.findMany({
            where: { isActive: true },
            orderBy: { sortOrder: "asc" },
        });
    },
    ["categories"],
    { revalidate: 3600, tags: ["categories"] }
);

export const getCategoryBySlug = unstable_cache(
    async (slug: string) => {
        return db.category.findUnique({
            where: { slug },
        });
    },
    ["category-by-slug"],
    { revalidate: 3600, tags: ["categories"] }
);

// Products
export const getProducts = unstable_cache(
    async (options?: {
        categorySlug?: string;
        featured?: boolean;
        isNew?: boolean;
        limit?: number;
    }) => {
        const where: Record<string, unknown> = { isActive: true };

        if (options?.featured) {
            where.isFeatured = true;
        }

        if (options?.isNew) {
            where.isNew = true;
        }

        if (options?.categorySlug) {
            where.category = { slug: options.categorySlug };
        }

        return db.product.findMany({
            where,
            include: { category: true },
            orderBy: { createdAt: "desc" },
            take: options?.limit,
        });
    },
    ["products"],
    { revalidate: 3600, tags: ["products"] }
);

export const getProductBySlug = unstable_cache(
    async (slug: string) => {
        return db.product.findUnique({
            where: { slug },
            include: { category: true },
        });
    },
    ["product-by-slug"],
    { revalidate: 3600, tags: ["products"] }
);

export async function getFeaturedProducts(limit = 4) {
    return getProducts({ featured: true, limit });
}

export async function getNewProducts(limit = 4) {
    return getProducts({ isNew: true, limit });
}

export async function getProductsByCategory(categorySlug: string) {
    return getProducts({ categorySlug });
}

export const getRelatedProducts = unstable_cache(
    async (productId: string, categoryId: string, limit = 4) => {
        return db.product.findMany({
            where: {
                isActive: true,
                categoryId,
                id: { not: productId },
            },
            include: { category: true },
            take: limit,
        });
    },
    ["related-products"],
    { revalidate: 3600, tags: ["products"] }
);

// Helper to parse JSON fields
export function parseProductImages(images: unknown): string[] {
    if (typeof images === "string") {
        try {
            return JSON.parse(images);
        } catch {
            return [];
        }
    }
    if (Array.isArray(images)) {
        return images;
    }
    return [];
}

export function parseProductColors(colors: unknown): ProductColor[] {
    if (typeof colors === "string") {
        try {
            return JSON.parse(colors);
        } catch {
            return [];
        }
    }
    if (Array.isArray(colors)) {
        return colors;
    }
    return [];
}

// Site Configuration
export const getSiteConfig = unstable_cache(
    async (pageKey: string) => {
        return db.siteConfig.findUnique({
            where: { pageKey },
        });
    },
    ["site-config"],
    { revalidate: 3600, tags: ["config"] }
);

export const getAllSiteConfigs = unstable_cache(
    async () => {
        return db.siteConfig.findMany();
    },
    ["all-site-configs"],
    { revalidate: 3600, tags: ["config"] }
);

// Posts / Novidades
export const getPublishedPosts = unstable_cache(
    async (limit?: number) => {
        return db.post.findMany({
            where: { isPublished: true },
            orderBy: { publishedAt: "desc" },
            take: limit,
        });
    },
    ["published-posts"],
    { revalidate: 3600, tags: ["posts"] }
);

export const getFeaturedPosts = unstable_cache(
    async (limit = 3) => {
        return db.post.findMany({
            where: { isPublished: true, isFeatured: true },
            orderBy: { publishedAt: "desc" },
            take: limit,
        });
    },
    ["featured-posts"],
    { revalidate: 3600, tags: ["posts"] }
);

export const getPostBySlug = unstable_cache(
    async (slug: string) => {
        return db.post.findUnique({
            where: { slug },
        });
    },
    ["post-by-slug"],
    { revalidate: 3600, tags: ["posts"] }
);
