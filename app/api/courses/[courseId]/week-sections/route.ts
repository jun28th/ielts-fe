import { backendFetch, errorResponse } from "@/lib/api/server";

// POST /api/courses/{courseId}/week-sections — create
export async function POST(request: Request, { params } : { params: Promise<{ courseId: string }> }) {
    const { courseId } = await params;
    let body: unknown;

    try {
        body = await request.json();
    } catch {
        return errorResponse(400, "Bad Request", "Invalid request body.");
    }

    let res: Response;
    let raw: string;

    try {
        res = await backendFetch(`/api/courses/${courseId}/week-sections`, {
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
        return data ? Response.json(data, { status: res.status }) : errorResponse(res.status, "Request Failed", "Failed to create week section.");
    }

    return data ? Response.json(data, { status: 201 }) : new Response(null, { status: 201 });
}