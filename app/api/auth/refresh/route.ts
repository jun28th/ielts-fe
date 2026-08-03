import { AuthResponse } from "@/types/auth-types";
import { cookies } from "next/headers";

export async function POST() {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (!refreshToken) {
        return Response.json(
            { message: "No active session." },
            { status: 401 }
        );
    }

    let res: Response;
    let data: unknown;

    try {
        res = await fetch(`http://localhost:8080/api/auth/refresh`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ refreshToken }),
        });

        data = await res.json();
    } catch {
        return Response.json(
            { message: "Unable to reach the server. Please try again later." },
            { status: 503 }
        );
    }

    if (!res.ok) {
        cookieStore.delete("refreshToken");
        cookieStore.delete("accessToken");

        return Response.json(data, { status: res.status });
    }

    const { accessToken, refreshToken: newRefreshToken, ...safeData } = data as AuthResponse;

    cookieStore.set("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60,
    });

    cookieStore.set("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/api/auth/refresh",
        maxAge: 60 * 60 * 24 * 7,
    });

    return Response.json(safeData, { status: res.status });
}