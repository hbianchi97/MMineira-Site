"use client";

import { useState, useRef } from "react";
import { Upload, Link, X, Loader2, Image as ImageIcon } from "lucide-react";

interface ImageUploaderProps {
    value: string;
    onChange: (url: string) => void;
    label?: string;
    placeholder?: string;
}

export default function ImageUploader({
    value,
    onChange,
    label = "Imagem",
    placeholder = "https://...",
}: ImageUploaderProps) {
    const [mode, setMode] = useState<"url" | "upload">("url");
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setError("Por favor, selecione uma imagem");
            return;
        }

        setUploading(true);
        setError(null);

        try {
            const res = await fetch("/api/uploads/request-url", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: file.name,
                    size: file.size,
                    contentType: file.type,
                }),
            });

            if (!res.ok) {
                throw new Error("Erro ao obter URL de upload");
            }

            const { uploadURL, objectPath } = await res.json();

            const uploadRes = await fetch(uploadURL, {
                method: "PUT",
                body: file,
                headers: { "Content-Type": file.type },
            });

            if (!uploadRes.ok) {
                throw new Error("Erro ao fazer upload");
            }

            onChange(objectPath);
        } catch (err) {
            console.error("Upload error:", err);
            setError("Erro ao fazer upload da imagem");
        } finally {
            setUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const getDisplayUrl = (url: string) => {
        if (url.startsWith("/objects/")) {
            return `/api${url}`;
        }
        return url;
    };

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <label className="block text-sm font-medium">{label}</label>
                <div className="flex gap-1 bg-gray-100 rounded-lg p-0.5">
                    <button
                        type="button"
                        onClick={() => setMode("url")}
                        className={`flex items-center gap-1 px-2 py-1 text-xs rounded transition ${
                            mode === "url"
                                ? "bg-white text-gray-900 shadow-sm"
                                : "text-gray-500 hover:text-gray-700"
                        }`}
                    >
                        <Link className="h-3 w-3" />
                        URL
                    </button>
                    <button
                        type="button"
                        onClick={() => setMode("upload")}
                        className={`flex items-center gap-1 px-2 py-1 text-xs rounded transition ${
                            mode === "upload"
                                ? "bg-white text-gray-900 shadow-sm"
                                : "text-gray-500 hover:text-gray-700"
                        }`}
                    >
                        <Upload className="h-3 w-3" />
                        Upload
                    </button>
                </div>
            </div>

            {mode === "url" ? (
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500"
                />
            ) : (
                <div className="relative">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        disabled={uploading}
                        className="hidden"
                        id="image-upload"
                    />
                    <label
                        htmlFor="image-upload"
                        className={`flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed rounded-lg cursor-pointer transition ${
                            uploading
                                ? "border-gray-200 bg-gray-50 cursor-wait"
                                : "border-amber-300 hover:border-amber-400 hover:bg-amber-50"
                        }`}
                    >
                        {uploading ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin text-amber-600" />
                                <span className="text-sm text-gray-600">
                                    Fazendo upload...
                                </span>
                            </>
                        ) : (
                            <>
                                <Upload className="h-5 w-5 text-amber-600" />
                                <span className="text-sm text-gray-600">
                                    Clique para selecionar uma imagem
                                </span>
                            </>
                        )}
                    </label>
                </div>
            )}

            {error && <p className="text-sm text-red-600">{error}</p>}

            {value && (
                <div className="relative rounded-lg overflow-hidden bg-gray-100">
                    <img
                        src={getDisplayUrl(value)}
                        alt="Preview"
                        className="w-full h-32 object-cover"
                        onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                        }}
                    />
                    <button
                        type="button"
                        onClick={() => onChange("")}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}
        </div>
    );
}
