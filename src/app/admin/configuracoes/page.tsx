"use client";

import { useState, useEffect } from "react";
import { Save, Image as ImageIcon, Loader2, Check, Home, Waves } from "lucide-react";
import MultiImageUploader from "@/components/admin/MultiImageUploader";

interface PageConfig {
    pageKey: string;
    label: string;
    images: string[];
    imageUrl: string;
    title: string;
    subtitle: string;
    description: string;
}

const defaultConfigs: PageConfig[] = [
    {
        pageKey: "home",
        label: "Pagina Inicial",
        images: ["https://images.unsplash.com/photo-1520013817300-1f4c1cb245ef?w=800&q=80"],
        imageUrl: "https://images.unsplash.com/photo-1520013817300-1f4c1cb245ef?w=800&q=80",
        title: "Nova Colecao 2026",
        subtitle: "Moda Praia Exclusiva do Rio",
        description: "Descubra pecas unicas com estampas autorais. Biquinis, maios e saidas de praia que realcam sua beleza natural.",
    },
    {
        pageKey: "biquinis",
        label: "Biquinis",
        images: ["https://images.unsplash.com/photo-1520013817300-1f4c1cb245ef?w=800&q=80"],
        imageUrl: "https://images.unsplash.com/photo-1520013817300-1f4c1cb245ef?w=800&q=80",
        title: "Biquinis",
        subtitle: "",
        description: "Biquinis exclusivos com estampas autorais do Rio de Janeiro",
    },
    {
        pageKey: "maios",
        label: "Maios",
        images: ["https://images.unsplash.com/photo-1520013817300-1f4c1cb245ef?w=800&q=80"],
        imageUrl: "https://images.unsplash.com/photo-1520013817300-1f4c1cb245ef?w=800&q=80",
        title: "Maios",
        subtitle: "",
        description: "Maios elegantes para todos os estilos e ocasioes",
    },
    {
        pageKey: "saidas-de-praia",
        label: "Saidas de Praia",
        images: ["https://images.unsplash.com/photo-1520013817300-1f4c1cb245ef?w=800&q=80"],
        imageUrl: "https://images.unsplash.com/photo-1520013817300-1f4c1cb245ef?w=800&q=80",
        title: "Saidas de Praia",
        subtitle: "",
        description: "Saidas de praia leves e estilosas para arrasar no verao",
    },
    {
        pageKey: "acessorios",
        label: "Acessorios",
        images: ["https://images.unsplash.com/photo-1520013817300-1f4c1cb245ef?w=800&q=80"],
        imageUrl: "https://images.unsplash.com/photo-1520013817300-1f4c1cb245ef?w=800&q=80",
        title: "Acessorios",
        subtitle: "",
        description: "Acessorios de praia como oculos, chapeus e joias",
    },
    {
        pageKey: "cangas",
        label: "Canga de Praia",
        images: ["https://images.unsplash.com/photo-1520013817300-1f4c1cb245ef?w=800&q=80"],
        imageUrl: "https://images.unsplash.com/photo-1520013817300-1f4c1cb245ef?w=800&q=80",
        title: "Canga de Praia",
        subtitle: "",
        description: "Cangas de praia com estampas exclusivas",
    },
    {
        pageKey: "bolsas",
        label: "Bolsas",
        images: ["https://images.unsplash.com/photo-1520013817300-1f4c1cb245ef?w=800&q=80"],
        imageUrl: "https://images.unsplash.com/photo-1520013817300-1f4c1cb245ef?w=800&q=80",
        title: "Bolsas",
        subtitle: "",
        description: "Bolsas de praia praticas e estilosas",
    },
];

function parseImages(images: unknown): string[] {
    if (Array.isArray(images)) return images;
    if (typeof images === "string") {
        try {
            return JSON.parse(images);
        } catch {
            return images ? [images] : [];
        }
    }
    return [];
}

export default function AdminSettings() {
    const [configs, setConfigs] = useState<PageConfig[]>(defaultConfigs);
    const [activeTab, setActiveTab] = useState("home");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState<string | null>(null);
    const [savedPages, setSavedPages] = useState<string[]>([]);

    useEffect(() => {
        fetchConfigs();
    }, []);

    const fetchConfigs = async () => {
        try {
            const res = await fetch("/api/admin/site-config");
            if (res.ok) {
                const data = await res.json();
                if (data.length > 0) {
                    const merged = defaultConfigs.map((dc) => {
                        const saved = data.find((d: PageConfig) => d.pageKey === dc.pageKey);
                        if (saved) {
                            const images = parseImages(saved.images);
                            return {
                                ...dc,
                                ...saved,
                                images: images.length > 0 ? images : (saved.imageUrl ? [saved.imageUrl] : dc.images),
                            };
                        }
                        return dc;
                    });
                    setConfigs(merged);
                }
            }
        } catch (error) {
            console.error("Error fetching configs:", error);
        } finally {
            setLoading(false);
        }
    };

    const updateConfig = (pageKey: string, field: keyof PageConfig, value: string | string[]) => {
        setConfigs((prev) =>
            prev.map((c) => (c.pageKey === pageKey ? { ...c, [field]: value } : c))
        );
    };

    const handleSave = async (pageKey: string) => {
        setSaving(pageKey);
        const config = configs.find((c) => c.pageKey === pageKey);
        if (!config) return;

        try {
            const res = await fetch("/api/admin/site-config", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    pageKey: config.pageKey,
                    images: config.images,
                    imageUrl: config.images[0] || config.imageUrl,
                    title: config.title,
                    subtitle: config.subtitle,
                    description: config.description,
                }),
            });

            if (res.ok) {
                setSavedPages((prev) => [...prev, pageKey]);
                setTimeout(() => {
                    setSavedPages((prev) => prev.filter((p) => p !== pageKey));
                }, 3000);
            }
        } catch (error) {
            console.error("Error saving config:", error);
        } finally {
            setSaving(null);
        }
    };

    const activeConfig = configs.find((c) => c.pageKey === activeTab);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Configuracoes do Site</h1>

            <div className="flex gap-2 mb-6 flex-wrap">
                {configs.map((config) => (
                    <button
                        key={config.pageKey}
                        onClick={() => setActiveTab(config.pageKey)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                            activeTab === config.pageKey
                                ? "bg-amber-600 text-white"
                                : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                        }`}
                    >
                        {config.pageKey === "home" ? (
                            <Home className="h-4 w-4" />
                        ) : (
                            <Waves className="h-4 w-4" />
                        )}
                        {config.label}
                    </button>
                ))}
            </div>

            {activeConfig && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <ImageIcon className="h-5 w-5 text-amber-600" />
                        {activeConfig.label}
                    </h2>

                    <div className="space-y-4">
                        <MultiImageUploader
                            value={activeConfig.images.join(", ")}
                            onChange={(imagesStr) => {
                                const images = imagesStr.split(",").map((s) => s.trim()).filter(Boolean);
                                updateConfig(activeConfig.pageKey, "images", images);
                            }}
                            label="Imagens da Pagina"
                        />

                        {activeConfig.images.length > 0 && activeConfig.images[0] && (
                            <div className="relative aspect-[21/9] rounded-lg overflow-hidden bg-gray-100">
                                <img
                                    src={activeConfig.images[0]}
                                    alt={`Preview ${activeConfig.label}`}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center">
                                    <div className="p-8 text-white max-w-xl">
                                        {activeConfig.subtitle && (
                                            <p className="text-sm text-amber-400 mb-2">
                                                {activeConfig.subtitle}
                                            </p>
                                        )}
                                        <h3 className="text-2xl font-bold mb-2">
                                            {activeConfig.title}
                                        </h3>
                                        <p className="text-white/80">{activeConfig.description}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeConfig.images.length > 1 && (
                            <div className="grid grid-cols-4 gap-2">
                                {activeConfig.images.slice(1).map((img, idx) => (
                                    <div key={idx} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                                        <img src={img} alt={`Imagem ${idx + 2}`} className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeConfig.pageKey === "home" && (
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Subtitulo (tag pequena)
                                </label>
                                <input
                                    type="text"
                                    value={activeConfig.subtitle}
                                    onChange={(e) =>
                                        updateConfig(activeConfig.pageKey, "subtitle", e.target.value)
                                    }
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500"
                                    placeholder="Ex: Nova Colecao 2026"
                                />
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Titulo Principal
                            </label>
                            <input
                                type="text"
                                value={activeConfig.title}
                                onChange={(e) =>
                                    updateConfig(activeConfig.pageKey, "title", e.target.value)
                                }
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Descricao
                            </label>
                            <textarea
                                value={activeConfig.description}
                                onChange={(e) =>
                                    updateConfig(activeConfig.pageKey, "description", e.target.value)
                                }
                                rows={3}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 resize-none"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end mt-6">
                        <button
                            onClick={() => handleSave(activeConfig.pageKey)}
                            disabled={saving === activeConfig.pageKey}
                            className="flex items-center gap-2 bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition disabled:opacity-50"
                        >
                            {saving === activeConfig.pageKey ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    Salvando...
                                </>
                            ) : savedPages.includes(activeConfig.pageKey) ? (
                                <>
                                    <Check className="h-5 w-5" />
                                    Salvo!
                                </>
                            ) : (
                                <>
                                    <Save className="h-5 w-5" />
                                    Salvar {activeConfig.label}
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
