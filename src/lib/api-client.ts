import { ApiError } from './api-errors';

export async function apiClient<T = any>(
    url: string,
    options: RequestInit = {}
): Promise<T> {
    const response = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        ...options,
    });

    if (!response.ok) {
        const errorText = await response.text();
        let errorMessage: string;

        try {
            const errorJson = JSON.parse(errorText);
            errorMessage = errorJson.message || errorJson.error || `HTTP ${response.status}`;
        } catch {
            errorMessage = errorText || `HTTP ${response.status}`;
        }

        throw new ApiError(errorMessage, response.status);
    }

    // Handle empty responses
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
        return {} as T;
    }

    return response.json();
}

export const api = {
    get: <T = any>(url: string, options?: RequestInit) =>
        apiClient<T>(url, { ...options, method: 'GET' }),
    post: <T = any>(url: string, data?: any, options?: RequestInit) =>
        apiClient<T>(url, {
            ...options,
            method: 'POST',
            body: data ? JSON.stringify(data) : undefined,
        }),
    put: <T = any>(url: string, data?: any, options?: RequestInit) =>
        apiClient<T>(url, {
            ...options,
            method: 'PUT',
            body: data ? JSON.stringify(data) : undefined,
        }),
    delete: <T = any>(url: string, options?: RequestInit) =>
        apiClient<T>(url, { ...options, method: 'DELETE' }),
};
