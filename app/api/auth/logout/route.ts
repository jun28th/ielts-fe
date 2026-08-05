import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (refreshToken) {
        try {
            const res = await fetch(`${process.env.BACKEND_API_URL}/api/auth/logout`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ refreshToken }),
            });

            if (!res.ok) {
                console.error(`Backend logout responded with status ${res.status}`);
            }
        } catch (error) {
            console.error("Unable to reach the server during logout:", error);
        }
    }

    const response = NextResponse.json({ success: true });
    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");

    return response;
}