import { cookies } from "next/headers";
import { NextResponse } from "next/server";

async function authHeaders() {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    return {
        "Content-Type": "application/json",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    };
}

// GET /api/roles — list
export async function GET() {
    const res = await fetch(`${process.env.BACKEND_API_URL}/api/roles`, {
        headers: await authHeaders(),
        cache: "no-store",
    });

    if (!res.ok) {
        return NextResponse.json({ message: "Failed to load roles" }, { status: res.status });
    }

    return NextResponse.json(await res.json());
}