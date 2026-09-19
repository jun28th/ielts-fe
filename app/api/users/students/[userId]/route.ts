import { backendFetch, errorResponse } from "@/lib/api/server";

// PATCH /api/users/students/{userId} - update student account
export async function PATCH(request: Request, { params } : { params: Promise<{ userId: string }> }) {
    const { userId } = await params;

    let body: unknown;

    try {
        body = await request.json();
    } catch {
        return errorResponse(400, "Bad Request", "Invalid request body.");
    }

    let res: Response;
    let raw: string;

    try {
        res = await backendFetch(`/api/users/students/${userId}`, {
            method: "PATCH",
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
        return data ? Response.json(data, { status: res.status }) : errorResponse(res.status, "Request Failed", "Failed to update student account.");
    }

    return data ? Response.json(data, { status: 200 }) : new Response(null, { status: 204 });
}