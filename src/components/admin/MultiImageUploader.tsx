"use client";

import { useState, useRef } from "react";
import { Upload, Link, X, Loader2, Plus, CheckCircle } from "lucide-react";

interface MultiImageUploaderProps {
    value: string;
    onChange: (urls: string) => void;
    label?: string;
}

interface UploadProgress {
    name: string;
    status: "uploading" | "done" | "error";
}

export default function MultiImageUploader({
    value,
    onChange,
    label = "Imagens do Produto",
}: MultiImageUploaderProps) {
    const [mode, setMode] = useState<"url" | "upload">("url");
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const images = value
        .split(",")
        .map((url) => url.trim())
        .filter(Boolean);

    const uploadSingleFile = async (file: File): Promise<string | null> => {
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

            return objectPath;
        } catch (err) {
            console.error("Upload error:", err);
            return null;
        }
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const imageFiles = Array.from(files).filter((file) =>
            file.type.startsWith("image/")
        );

        if (imageFiles.length === 0) {
            setError("Por favor, selecione apenas imagens");
            return;
        }

        if (imageFiles.length !== files.length) {
            setError("Alguns arquivos nao eram imagens e foram ignorados");
        } else {
            setError(null);
        }

        setUploading(true);
        setUploadProgress(
            imageFiles.map((f) => ({ name: f.name, status: "uploading" }))
        );

        const newPaths: string[] = [];

        for (let i = 0; i < imageFiles.length; i++) {
            const file = imageFiles[i];
            const path = await uploadSingleFile(file);

            setUploadProgress((prev) =>
                prev.map((p, idx) =>
                    idx === i ? { ...p, status: path ? "done" : "error" } : p
                )
            );

            if (path) {
                newPaths.push(path);
            }
        }

        if (newPaths.length > 0) {
            const allImages = [...images, ...newPaths];
            onChange(allImages.join(", "));
        }

        setUploading(false);
        setTimeout(() => setUploadProgress([]), 2000);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const removeImage = (index: number) => {
        const newImages = images.filter((_, i) => i !== index);
        onChange(newImages.join(", "));
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
                    placeholder="URLs separadas por virgula"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500"
                />
            ) : (
                <div className="space-y-3">
                    {images.length > 0 && (
                        <div className="grid grid-cols-4 gap-2">
                            {images.map((img, index) => (
                                <div
                                    key={index}
                                    className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 group"
                                >
                                    <img
                                        src={getDisplayUrl(img)}
                                        alt={`Imagem ${index + 1}`}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src =
                                                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23f3f4f6' width='100' height='100'/%3E%3Ctext x='50' y='50' text-anchor='middle' dy='.3em' fill='%239ca3af'%3E?%3C/text%3E%3C/svg%3E";
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {uploadProgress.length > 0 && (
                        <div className="space-y-1 p-3 bg-gray-50 rounded-lg">
                            {uploadProgress.map((item, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center gap-2 text-sm"
                                >
                                    {item.status === "uploading" && (
                                        <Loader2 className="h-4 w-4 animate-spin text-amber-600" />
                                    )}
                                    {item.status === "done" && (
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                    )}
                                    {item.status === "error" && (
                                        <X className="h-4 w-4 text-red-600" />
                                    )}
                                    <span
                                        className={`truncate ${
                                            item.status === "error"
                                                ? "text-red-600"
                                                : "text-gray-600"
                                        }`}
                                    >
                                        {item.name}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileSelect}
                        disabled={uploading}
                        className="hidden"
                        id="multi-image-upload"
                    />
                    <label
                        htmlFor="multi-image-upload"
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
                                <Plus className="h-5 w-5 text-amber-600" />
                                <span className="text-sm text-gray-600">
                                    Adicionar imagens (pode selecionar varias)
                                </span>
                            </>
                        )}
                    </label>
                </div>
            )}

            {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
    );
}
