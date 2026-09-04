import { ErrorResponse } from "@/types/error-types";
import { cookies } from "next/headers";
import "server-only";

export async function authHeaders() {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    return {
        "Content-Type": "application/json",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    };
}

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