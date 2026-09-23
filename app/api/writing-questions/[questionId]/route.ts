import { backendFetch, errorResponse } from "@/lib/api/server";

// PATCH /api/writing-questions/{questionId} - update writing question (multipart)
export async function PATCH(request: Request, { params } : { params: Promise<{ questionId: string }> }) {
    const { questionId } = await params;

    let body: FormData;

    try {
        body = await request.formData();
    } catch {
        return errorResponse(400, "Bad Request", "Invalid request body.");
    }

    let res: Response;
    let raw: string;

    try {
        res = await backendFetch(`/api/writing-questions/${questionId}`, {
            method: "PATCH",
            body,
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
        return data ? Response.json(data, { status: res.status }) : errorResponse(res.status, "Request Failed", "Failed to update writing question.");
    }

    return data ? Response.json(data, { status: 200 }) : new Response(null, { status: 204 });
}

// DELETE /api/writing-questions/{questionId} - delete writing question
export async function DELETE(request: Request, { params } : { params: Promise<{ questionId: string }> }) {
    const { questionId } = await params;

    let res: Response;
    let raw: string;

    try {
        res = await backendFetch(`/api/writing-questions/${questionId}`, {
            method: "DELETE",
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
        return data ? Response.json(data, { status: res.status }) : errorResponse(res.status, "Request Failed", "Failed to delete writing question.");
    }

    return data ? Response.json(data, { status: 200 }) : new Response(null, { status: 204 });
}