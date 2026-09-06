import { ErrorResponse } from "@/types/error-types";
import { cookies } from "next/headers";
import "server-only";

type BackendInit = Omit<RequestInit, "headers"> & {
    headers?: Record<string, string>;
};

export function errorResponse(status: number, error: string, message: string) {
    return Response.json(
        {
            status,
            error,
            message,
            timestamp: new Date().toISOString(),
        } satisfies ErrorResponse,
        { status }
    );
}

// Fetches data from the backend API, automatically handling token refresh if necessary.
export async function backendFetch(path: string, init: BackendInit = {}) : Promise<Response> {
    const cookieStore = await cookies();

    const isFormData = init.body instanceof FormData;

    const call = (token?: string) => 
        fetch(`${process.env.BACKEND_API_URL}${path}`, {
            ...init,
            cache: "no-store",
            headers: {
                ...(isFormData ? {} : { "Content-Type": "application/json" }),
                ...(token ? { "Authorization": `Bearer ${token}` } : {}),
                ...init.headers,
            }
        });
    
    const res = await call(cookieStore.get("access_token")?.value);

    if (res.status !== 401) return res;

    const refreshToken = await cookieStore.get("refreshToken")?.value;
    if (!refreshToken) return res;

    let refreshRes: Response;

    try {
        refreshRes = await fetch(`${process.env.BACKEND_API_URL}/api/auth/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken }),
        });
    } catch {
        return res;
    }

    if (!refreshRes.ok) {
        cookieStore.delete("accessToken");
        cookieStore.delete("refreshToken");
        return res;
    }

    const tokens = await refreshRes.json();

    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict" as const,
        path: "/",
    };

    cookieStore.set("accessToken", tokens.accessToken, {
        ...cookieOptions,
        maxAge: 60 * 60,
    });

    cookieStore.set("refreshToken", tokens.refreshToken, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60,
    });

    return call(tokens.accessToken);
}