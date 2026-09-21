import { backendFetch, errorResponse } from "@/lib/api/server";

// POST /api/writing-questions - create writing question (multipart)
export async function POST(request: Request) {
    let formData: FormData;

    try {
        formData = await request.formData();
    } catch {
        return errorResponse(400, "Bad Request", "Invalid form data.");
    }

    let res: Response;
    let raw: string;

    try {
        res = await backendFetch("/api/writing-questions", {
            method: "POST",
            body: formData,
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
        return data ? Response.json(data, { status: res.status }) : errorResponse(res.status, "Request Failed", "Failed to create writing question.");
    }

    return data ? Response.json(data, { status: 201 }) : new Response(null, { status: 201 });
}

// GET /api/writing-questions - get all writing questions
export async function GET(request: Request) {
    const { search } = new URL(request.url);

    let res: Response;
    let raw: string;

    try {
        res = await backendFetch(`/api/writing-questions${search}`, {
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
        return data ? Response.json(data, { status: res.status }) : errorResponse(res.status, "Request Failed", "Failed to load writing questions.");
    }

    return data ? Response.json(data, { status: 200 }) : new Response(null, { status: 204 });
}