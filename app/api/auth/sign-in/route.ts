import { errorResponse } from "@/lib/api/server";
import { AuthResponse } from "@/types/auth-types";
import { cookies } from "next/headers";

// POST /api/auth/sign-in — sign in
export async function POST(request: Request) {
    let body: unknown;

    try {
        body = await request.json();
    } catch {
        return errorResponse(400, "Bad Request", "Invalid request body.");
    }

    let res: Response;
    let raw: string;

    try {
        res = await fetch(`${process.env.BACKEND_API_URL}/api/auth/sign-in`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        raw = await res.text();
    } catch {
        return errorResponse(503, "Service Unavailable", "Unable to reach the server. Please try again later.");
    }

    let data: unknown = null;

    if (raw) {
        try {
            data = JSON.parse(raw);
        } catch {
            return errorResponse(res.status, "Unexpected Response", raw);
        }
    }

    if (!res.ok) {
        return data ? Response.json(data, { status: res.status }) : errorResponse(res.status, "Request Failed", "Sign in failed.");
    }

    const { accessToken, refreshToken, ...safeData } = (data ?? {}) as AuthResponse;

    if (!accessToken || !refreshToken) {
        return errorResponse(502, "Unexpected Response", "Sign in response is missing tokens.");
    }

    const cookieStore = await cookies();

    cookieStore.set("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60,
    });

    cookieStore.set("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
    });

    return Response.json(safeData, { status: 200 });
}