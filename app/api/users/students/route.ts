import { backendFetch, errorResponse } from "@/lib/api/server";

// POST /api/users/students - create student account
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
        res = await backendFetch("/api/users/students", {
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
        return data ? Response.json(data, { status: res.status }) : errorResponse(res.status, "Request Failed", "Failed to create student account.");
    }

    return data ? Response.json(data, { status: 201 }) : new Response(null, { status: 201 });
}

// GET /api/users/students - get all student accounts
export async function GET(request: Request) {
    const { search } = new URL(request.url);

    let res: Response;
    let raw: string;

    try {
        res = await backendFetch(`/api/users/students${search}`, {
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
        return data ? Response.json(data, { status: res.status }) : errorResponse(res.status, "Request Failed", "Failed to load student accounts.");
    }

    return data ? Response.json(data, { status: 200 }) : new Response(null, { status: 204 });
}