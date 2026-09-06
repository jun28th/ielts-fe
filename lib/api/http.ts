class ApiError extends Error {
    constructor(message: string, public status: number) {
        super(message);
    }
}

async function request<T>(input: string, init?: RequestInit): Promise<T> {
    const isFormData = init?.body instanceof FormData;

    const res = await fetch(input, {
        ...init,
        headers: {
            ...(isFormData ? {} : { "Content-Type": "application/json" }),
            ...init?.headers,
        },
    });

    if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new ApiError(body?.message ?? "Request failed", res.status);
    }

    if (res.status === 204) return undefined as T;

    return res.json();
}

export const http = {
    get: <T>(url: string) => request<T>(url, { method: "GET" }),
    post: <T>(url: string, data: unknown) => request<T>(url, { method: "POST", body: JSON.stringify(data) }),
    patch: <T>(url: string, data: unknown) => request<T>(url, { method: "PATCH", body: JSON.stringify(data) }),
    delete: <T>(url: string) => request<T>(url, { method: "DELETE" })
};

export { ApiError };