import { backendFetch, errorResponse } from "@/lib/api/server";

type RouteParams = { params: Promise<{ courseId: string; weekSectionId: string }> };

// PATCH /api/courses/{courseId}/week-sections/{weekSectionId} - update
export async function PATCH(request: Request, { params } : RouteParams) {
    const { courseId, weekSectionId } = await params;

    let body: unknown;

    try {
        body = await request.json();
    } catch {
        return errorResponse(400, "Bad Request", "Invalid request body.");
    }

    let res: Response;
    let raw: string;

    try {
        res = await backendFetch(`/api/courses/${courseId}/week-sections/${weekSectionId}`, {
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
        return data ? Response.json(data, { status: res.status }) : errorResponse(res.status, "Request Failed", "Failed to update week section.");
    }

    return data ? Response.json(data, { status: 200 }) : new Response(null, { status: 204 });
}

// DELETE /api/courses/{courseId}/week-sections/{weekSectionId} - delete
export async function DELETE(_request: Request, { params } : RouteParams) {
    const { courseId, weekSectionId } = await params;

    let res: Response;
    let raw: string;

    try {
        res = await backendFetch(`/api/courses/${courseId}/week-sections/${weekSectionId}`, {
            method: "DELETE",
        });

        raw = await res.text();
    } catch {
        return errorResponse(503, "Service Unavailable", "Unable to reach the server. Please try again later.");
    }

    if (!res.ok) {
        let data: unknown = null;

        if (raw) {
            try {
                data = JSON.parse(raw);
            } catch {
                return errorResponse(res.status, "Unexpected Response", raw);
            }
        }

        return data ? Response.json(data, { status: res.status }) : errorResponse(res.status, "Request Failed", "Failed to delete week section.");
    }

    return new Response(null, { status: 204 });
}