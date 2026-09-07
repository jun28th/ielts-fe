import { backendFetch, errorResponse } from "@/lib/api/server";

// POST /api/courses — create
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
        res = await backendFetch("/api/courses", {
            method: "POST",
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
        return data ? Response.json(data, { status: res.status }) : errorResponse(res.status, "Request Failed", "Failed to create course.");
    }

    return data ? Response.json(data, { status: 201 }) : new Response(null, { status: 201 });
}

// GET /api/courses — list
export async function GET(request: Request) {
    const { search } = new URL(request.url);

    let res: Response;
    let raw: string;

    try {
        res = await backendFetch(`/api/courses${search}`, {
            method: "GET",
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