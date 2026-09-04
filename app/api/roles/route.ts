import { authHeaders, errorResponse } from "@/lib/api/server";

// GET /api/roles — list
export async function GET() {
    let res: Response;
    let raw: string;

    try {
        res = await fetch(`${process.env.BACKEND_API_URL}/api/roles`, {
            headers: await authHeaders(),
            cache: "no-store",
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
        return data ? Response.json(data, { status: res.status }) : errorResponse(res.status, "Request Failed", "Failed to load roles.");
    }

    return data ? Response.json(data, { status: 200 }) : new Response(null, { status: 204 });
}