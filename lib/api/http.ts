class ApiError extends Error {
    constructor(message: string, public status: number) {
        super(message);
    }
}

function toBody(data: unknown): BodyInit {
    if (data instanceof FormData) return data;
    return JSON.stringify(data);
}

async function request<T>(input: string, init?: RequestInit): Promise<T> {
    const isJson = typeof init?.body === "string";

    const res = await fetch(input, {
        ...init,
        headers: {
            ...(isJson ? { "Content-Type": "application/json" } : {}),
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
    post: <T>(url: string, data: unknown) => request<T>(url, { method: "POST", body: toBody(data) }),
    patch: <T>(url: string, data: unknown) => request<T>(url, { method: "PATCH", body: toBody(data) }),
    delete: <T>(url: string) => request<T>(url, { method: "DELETE" })
};

export { ApiError };