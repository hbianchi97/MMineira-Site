"use client";

import { useState } from "react";
import { Save, Image as ImageIcon } from "lucide-react";

export default function AdminSettings() {
    const [heroImage, setHeroImage] = useState(
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80"
    );
    const [heroTitle, setHeroTitle] = useState("Nova Coleção Verão 2026");
    const [heroSubtitle, setHeroSubtitle] = useState(
        "Descubra peças exclusivas para arrasar nesta temporada"
    );
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleSave = async () => {
        setSaving(true);
        
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        setSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Configurações</h1>

            <div className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <ImageIcon className="h-5 w-5 text-amber-600" />
                        Banner Principal (Hero)
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                URL da Imagem
                            </label>
                            <input
                                type="text"
                                value={heroImage}
                                onChange={(e) => setHeroImage(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500"
                                placeholder="https://..."
                            />
                        </div>

                        {heroImage && (
                            <div className="relative aspect-[21/9] rounded-lg overflow-hidden bg-gray-100">
                                <img
                                    src={heroImage}
                                    alt="Preview do Hero"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent flex items-center">
                                    <div className="p-8 text-white max-w-xl">
                                        <h3 className="text-2xl font-bold mb-2">
                                            {heroTitle}
                                        </h3>
                                        <p className="text-white/80">{heroSubtitle}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Título
                            </label>
                            <input
                                type="text"
                                value={heroTitle}
                                onChange={(e) => setHeroTitle(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Subtítulo
                            </label>
                            <input
                                type="text"
                                value={heroSubtitle}
                                onChange={(e) => setHeroSubtitle(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition disabled:opacity-50"
                    >
                        {saving ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Salvando...
                            </>
                        ) : saved ? (
                            <>
                                <Save className="h-5 w-5" />
                                Salvo!
                            </>
                        ) : (
                            <>
                                <Save className="h-5 w-5" />
                                Salvar Alterações
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
