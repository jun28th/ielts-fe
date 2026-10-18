import { backendFetch, errorResponse } from "@/lib/api/server";

// POST /api/writing-assignments/{assignmentId}/ai-corrections - generate AI corrections
export async function POST(request: Request, { params }: { params: Promise<{ assignmentId: string }> }) {
    const { assignmentId } = await params;

    let body: unknown;

    try {
        body = await request.json();
    } catch {
        return errorResponse(400, "Bad Request", "Invalid request body.");
    }

    let res: Response;
    let raw: string;

    try {
        res = await backendFetch(`/api/writing-assignments/${assignmentId}/ai-corrections`, {
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
        return data ? Response.json(data, { status: res.status }) : errorResponse(res.status, "Request Failed", "Failed to generate AI corrections.");
    }

    return data ? Response.json(data, { status: 200 }) : new Response(null, { status: 204 });
}