import { cookies } from "next/headers";
import { NextRequest } from "next/server";

async function authHeaders() {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    return {
        "Content-Type": "application/json",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    };
}

export async function PATCH(request: NextRequest, { params } : { params: Promise<{ roleId: string }> }) {
    const { roleId } = await params;
    const body = await request.json();

    const res = await fetch(`${process.env.BACKEND_API_URL}/api/roles/${roleId}`, {
        method: "PATCH",
        headers: await authHeaders(),
        body: JSON.stringify(body),
    });

    if (!res.ok) {
        return new Response(JSON.stringify({ message: "Failed to update role" }), { status: res.status });
    }

    return new Response(JSON.stringify(await res.json()), { status: res.status });
}