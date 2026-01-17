import { db } from "@/lib/db";
import { Category, Product } from "@prisma/client";

export type ProductWithCategory = Product & {
    category: Category;
};

export type ProductColor = {
    name: string;
    hex: string;
};

// Categories
export async function getCategories() {
    return db.category.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
    });
}

export async function getCategoryBySlug(slug: string) {
    return db.category.findUnique({
        where: { slug },
    });
}

// Products
export async function getProducts(options?: {
    categorySlug?: string;
    featured?: boolean;
    isNew?: boolean;
    limit?: number;
}) {
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
}

export async function getProductBySlug(slug: string) {
    return db.product.findUnique({
        where: { slug },
        include: { category: true },
    });
}

export async function getFeaturedProducts(limit = 4) {
    return getProducts({ featured: true, limit });
}

export async function getNewProducts(limit = 4) {
    return getProducts({ isNew: true, limit });
}

export async function getProductsByCategory(categorySlug: string) {
    return getProducts({ categorySlug });
}

export async function getRelatedProducts(
    productId: string,
    categoryId: string,
    limit = 4
) {
    return db.product.findMany({
        where: {
            isActive: true,
            categoryId,
            id: { not: productId },
        },
        include: { category: true },
        take: limit,
    });
}

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
export async function getSiteConfig(pageKey: string) {
    return db.siteConfig.findUnique({
        where: { pageKey },
    });
}

export async function getAllSiteConfigs() {
    return db.siteConfig.findMany();
}

// Posts / Novidades
export async function getPublishedPosts(limit?: number) {
    return db.post.findMany({
        where: { isPublished: true },
        orderBy: { publishedAt: "desc" },
        take: limit,
    });
}

export async function getFeaturedPosts(limit = 3) {
    return db.post.findMany({
        where: { isPublished: true, isFeatured: true },
        orderBy: { publishedAt: "desc" },
        take: limit,
    });
}

export async function getPostBySlug(slug: string) {
    return db.post.findUnique({
        where: { slug },
    });
}
