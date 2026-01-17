import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function getImageUrl(url: string): string {
    if (!url) return "";
    if (url.startsWith("/objects/")) {
        return `/api${url}`;
    }
    return url;
}
