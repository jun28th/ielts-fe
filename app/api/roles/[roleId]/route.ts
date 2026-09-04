import { authHeaders, errorResponse } from "@/lib/api/server";
import { NextRequest } from "next/server";

// PATCH /api/roles/[roleId] - update
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ roleId: string }> }) {
    const { roleId } = await params;

    let body: unknown;

    try {
        body = await request.json();
    } catch {
        return errorResponse(400, "Bad Request", "Invalid request body.");
    }

    let res: Response;
    let raw: string;

    try {
        res = await fetch(`${process.env.BACKEND_API_URL}/api/roles/${roleId}`, {
            method: "PATCH",
            headers: await authHeaders(),
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
        return data ? Response.json(data, { status: res.status }) : errorResponse(res.status, "Request Failed", "Failed to update role.");
    }

    return data ? Response.json(data, { status: 200 }) : new Response(null, { status: 204 });
}