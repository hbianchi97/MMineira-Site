import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/brand-config";
import { ClerkProvider } from "@clerk/nextjs";
import { Providers } from "@/components/providers/Providers";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: {
        default: site.name,
        template: `%s | ${site.name}`,
    },
    description: site.description,
    keywords: site.keywords,
    authors: [{ name: site.author }],
    icons: {
        icon: site.icons.favicon,
        apple: site.icons.apple,
    },
    themeColor: "#b45309",
    manifest: "/manifest.json",
    appleWebApp: {
        capable: true,
        statusBarStyle: "default",
        title: site.name,
    },
    formatDetection: {
        telephone: false,
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ClerkProvider>
            <html lang="pt-BR">
                <body
                    className={`${geistSans.variable} ${geistMono.variable} antialiased`}
                >
                    <Providers>{children}</Providers>
                    <script
                        dangerouslySetInnerHTML={{
                            __html: `
                              if ('serviceWorker' in navigator) {
                                window.addEventListener('load', function() {
                                  navigator.serviceWorker.register('/sw.js');
                                });
                              }
                            `,
                        }}
                    />
                </body>
            </html>
        </ClerkProvider>
    );
}

