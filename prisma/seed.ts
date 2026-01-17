import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Seeding database...");

    // Create categories
    const biquinis = await prisma.category.upsert({
        where: { slug: "biquinis" },
        update: {},
        create: {
            name: "Biquínis",
            slug: "biquinis",
            description: "Modelos exclusivos com estampas únicas para você arrasar na praia",
            imageUrl: "https://images.unsplash.com/photo-1520013817300-1f4c1cb245ef?w=1200&q=80",
            sortOrder: 1,
        },
    });

    const maios = await prisma.category.upsert({
        where: { slug: "maios" },
        update: {},
        create: {
            name: "Maiôs",
            slug: "maios",
            description: "Elegância e conforto em peças que valorizam seu corpo",
            imageUrl: "https://images.unsplash.com/photo-1570976447640-ac859083963f?w=1200&q=80",
            sortOrder: 2,
        },
    });

    const saidas = await prisma.category.upsert({
        where: { slug: "saidas-de-praia" },
        update: {},
        create: {
            name: "Saídas de Praia",
            slug: "saidas-de-praia",
            description: "Complete seu look de verão com nossas saídas exclusivas",
            imageUrl: "https://images.unsplash.com/photo-1469504512102-900f29606341?w=1200&q=80",
            sortOrder: 3,
        },
    });

    console.log("✅ Categories created:", { biquinis, maios, saidas });

    // Create products
    const products = await Promise.all([
        prisma.product.upsert({
            where: { slug: "biquini-tropical-verde-esmeralda" },
            update: {},
            create: {
                name: "Biquíni Tropical Verde Esmeralda",
                slug: "biquini-tropical-verde-esmeralda",
                description: `O Biquíni Tropical Verde Esmeralda é a peça perfeita para quem busca elegância e conforto na praia. Confeccionado com tecido de alta qualidade, oferece proteção UV e secagem rápida.

• Tecido com proteção UV 50+
• Secagem rápida
• Forro interno duplo
• Bojo removível
• Regulagem nas alças`,
                price: 18900,
                comparePrice: 22900,
                categoryId: biquinis.id,
                images: JSON.stringify([
                    "https://images.unsplash.com/photo-1594385208974-2e75f8d7bb48?w=800&q=80",
                    "https://images.unsplash.com/photo-1570976447640-ac859083963f?w=800&q=80",
                    "https://images.unsplash.com/photo-1520013817300-1f4c1cb245ef?w=800&q=80",
                ]),
                sizes: ["P", "M", "G", "GG"],
                colors: JSON.stringify([
                    { name: "Verde", hex: "#228B22" },
                    { name: "Azul", hex: "#1E90FF" },
                ]),
                stock: 15,
                weight: 150,
                isNew: true,
                isFeatured: true,
            },
        }),
        prisma.product.upsert({
            where: { slug: "biquini-coral-sunset" },
            update: {},
            create: {
                name: "Biquíni Coral Sunset",
                slug: "biquini-coral-sunset",
                description: `O Biquíni Coral Sunset traz as cores vibrantes do pôr do sol carioca. Perfeito para quem quer se destacar na praia.

• Tecido premium com elastano
• Forro interno completo
• Alças ajustáveis`,
                price: 16900,
                comparePrice: 19900,
                categoryId: biquinis.id,
                images: JSON.stringify([
                    "https://images.unsplash.com/photo-1510629954389-c1e0da47d414?w=800&q=80",
                ]),
                sizes: ["P", "M", "G", "GG"],
                colors: JSON.stringify([
                    { name: "Coral", hex: "#FF7F50" },
                    { name: "Rosa", hex: "#FF69B4" },
                ]),
                stock: 20,
                weight: 140,
                isFeatured: true,
            },
        }),
        prisma.product.upsert({
            where: { slug: "biquini-floral-azul" },
            update: {},
            create: {
                name: "Biquíni Floral Azul",
                slug: "biquini-floral-azul",
                description: `Estampa floral exclusiva em tons de azul. Elegância e feminilidade para o verão.`,
                price: 17900,
                categoryId: biquinis.id,
                images: JSON.stringify([
                    "https://images.unsplash.com/photo-1520013817300-1f4c1cb245ef?w=800&q=80",
                ]),
                sizes: ["M", "G"],
                colors: JSON.stringify([{ name: "Azul", hex: "#1E90FF" }]),
                stock: 8,
                weight: 145,
            },
        }),
        prisma.product.upsert({
            where: { slug: "maio-estampado-onca-premium" },
            update: {},
            create: {
                name: "Maiô Estampado Onça Premium",
                slug: "maio-estampado-onca-premium",
                description: `O Maiô Estampado Onça Premium traz a sofisticação da estampa animal print com o conforto que você merece.

• Modelagem que valoriza as curvas
• Tecido premium com elastano
• Decote em V elegante
• Forro interno completo`,
                price: 24900,
                categoryId: maios.id,
                images: JSON.stringify([
                    "https://images.unsplash.com/photo-1570976447640-ac859083963f?w=800&q=80",
                    "https://images.unsplash.com/photo-1594385208974-2e75f8d7bb48?w=800&q=80",
                ]),
                sizes: ["P", "M", "G", "GG"],
                colors: JSON.stringify([{ name: "Onça", hex: "#C19A6B" }]),
                stock: 12,
                weight: 200,
                isFeatured: true,
            },
        }),
        prisma.product.upsert({
            where: { slug: "maio-preto-elegance" },
            update: {},
            create: {
                name: "Maiô Preto Elegance",
                slug: "maio-preto-elegance",
                description: `Clássico e atemporal. O Maiô Preto Elegance é perfeito para quem busca sofisticação.`,
                price: 22900,
                categoryId: maios.id,
                images: JSON.stringify([
                    "https://images.unsplash.com/photo-1594385208974-2e75f8d7bb48?w=800&q=80",
                ]),
                sizes: ["P", "M", "G"],
                colors: JSON.stringify([{ name: "Preto", hex: "#000000" }]),
                stock: 10,
                weight: 190,
                isNew: true,
            },
        }),
        prisma.product.upsert({
            where: { slug: "saida-praia-renda-branca" },
            update: {},
            create: {
                name: "Saída de Praia Renda Branca",
                slug: "saida-praia-renda-branca",
                description: `Saída de praia em renda branca delicada. Perfeita para compor looks elegantes do dia para a noite.`,
                price: 13900,
                categoryId: saidas.id,
                images: JSON.stringify([
                    "https://images.unsplash.com/photo-1469504512102-900f29606341?w=800&q=80",
                ]),
                sizes: ["U"],
                colors: JSON.stringify([{ name: "Branco", hex: "#FFFFFF" }]),
                stock: 25,
                weight: 100,
                isNew: true,
                isFeatured: true,
            },
        }),
        prisma.product.upsert({
            where: { slug: "kimono-floral-tropical" },
            update: {},
            create: {
                name: "Kimono Floral Tropical",
                slug: "kimono-floral-tropical",
                description: `Kimono leve com estampa floral tropical. Ideal para usar sobre o biquíni ou maiô.`,
                price: 15900,
                comparePrice: 18900,
                categoryId: saidas.id,
                images: JSON.stringify([
                    "https://images.unsplash.com/photo-1469504512102-900f29606341?w=800&q=80",
                ]),
                sizes: ["U"],
                colors: JSON.stringify([{ name: "Floral", hex: "#FF6B6B" }]),
                stock: 18,
                weight: 120,
            },
        }),
    ]);

    console.log("✅ Products created:", products.length);
    console.log("🎉 Seed completed successfully!");
}

main()
    .catch((e) => {
        console.error("❌ Seed error:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
