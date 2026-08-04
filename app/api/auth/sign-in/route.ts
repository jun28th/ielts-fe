import { AuthResponse } from "@/types/auth-types";
import { ErrorResponse } from "@/types/error-types";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.BACKEND_API_URL ?? "http://localhost:8080";

export async function POST(request: Request) {
    const body = await request.json();

    let res: Response;
    let data: unknown;

    try {
        res = await fetch(`${BACKEND_URL}/api/auth/sign-in`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        data = await res.json();
    } catch {
        return Response.json(
            { message: "Unable to reach the server. Please try again later." },
            { status: 503 }
        );
    }

    if (!res.ok) {
        return Response.json(data as ErrorResponse, { status: res.status });
    }

    const { accessToken, refreshToken, ...safeData } = data as AuthResponse;

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

    return Response.json(safeData, { status: res.status });
}