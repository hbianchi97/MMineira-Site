export const site = {
    name: "Menina Mineira",
    shortName: "Menina Mineira",
    description: "Moda praia exclusiva do Rio de Janeiro. Biquínis, maiôs e saídas de praia com estampas únicas. Do Rio de Janeiro para todo Brasil!",
    keywords: [
        "moda praia",
        "biquíni",
        "maiô",
        "saída de praia",
        "beachwear",
        "moda fitness",
        "Rio de Janeiro",
        "praia",
        "verão",
        "moda feminina",
    ],
    author: "Menina Mineira",
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    logo: {
        light: "/logo-light.svg",
        dark: "/logo-dark.svg",
    },
    icons: {
        favicon: "/favicon.ico",
        apple: "/apple-touch-icon.png",
    },
    ogImage: "/og-image.png",
    socials: {
        instagram: "https://instagram.com/meninamineilaoficial",
        whatsapp: "https://wa.me/5534998060854",
    },
    support: {
        email: "contato@meninamineira.com.br",
        phone: "(34) 99806-0854",
        address: "Av. Niemeyer 769 - São Conrado, Rio de Janeiro - RJ",
    },
    analytics: {
        gtm: process.env.NEXT_PUBLIC_GTM_ID,
        ga4: process.env.NEXT_PUBLIC_GA_ID,
        pixel: process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID,
    },
};
