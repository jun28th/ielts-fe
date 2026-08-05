import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "./lib/session";
import { AdminHomeRoute, SignInRoute, StudentHomeRoute, TeacherHomeRoute } from "./lib/routes";
import { Role } from "./types/auth-types";

type RouteProtection = {
    prefix: string;
    allowedRoles: Role[];
};

const PROTECTED_ROUTES: RouteProtection[] = [
    { prefix: StudentHomeRoute, allowedRoles: ["STUDENT"] },
    { prefix: TeacherHomeRoute, allowedRoles: ["TEACHER"] },
    { prefix: AdminHomeRoute, allowedRoles: ["ADMIN"] },
];

const ROLE_HOME: Record<Role, string> = {
    STUDENT: StudentHomeRoute,
    TEACHER: TeacherHomeRoute,
    ADMIN: AdminHomeRoute,
};

const ROLE_PRIORITY: Role[] = ["ADMIN", "TEACHER", "STUDENT"];

function getPrimaryRole(roles: Role[]): Role {
    return ROLE_PRIORITY.find((r) => roles.includes(r)) ?? roles[0];
}

async function tryRefresh(refreshToken: string) {
    try {
        const res = await fetch(`${process.env.BACKEND_API_URL}/api/auth/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken }),
        });

        if (!res.ok) return null;

        const data = await res.json();

        return {
            accessToken: data.accessToken as string,
            refreshToken: data.refreshToken as string,
        };
    } catch {
        return null;
    }
} 

export default async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const isAuthRoute = pathname.startsWith("/auth");
    const matchedRoute = PROTECTED_ROUTES.find((route) =>
        pathname.startsWith(route.prefix)
    );

    const accessToken = request.cookies.get('accessToken')?.value;
    let payload = await decrypt(accessToken);

    // accessToken hết hạn/invalid -> thử refresh nếu có refreshToken
    let newTokens: { accessToken: string; refreshToken: string } | null = null;

    if (!payload) {
        const refreshToken = request.cookies.get("refreshToken")?.value;

        if (refreshToken) {
            newTokens = await tryRefresh(refreshToken);
            if (newTokens) {
                payload = await decrypt(newTokens.accessToken);
            }
        }
    }

    // Not logged in (kể cả sau khi thử refresh), trying to access protected route
    if (matchedRoute && !payload) {
        const response = NextResponse.redirect(new URL(SignInRoute, request.url));
        // refresh fail hoặc không có refreshToken -> cookie cũ (nếu còn) đã vô nghĩa, clear luôn
        if (!newTokens) {
            response.cookies.delete("accessToken");
            response.cookies.delete("refreshToken");
        }
        return response;
    }

    let response: NextResponse;

    if (payload) {
        const roles = (payload.roles as Role[]) ?? [];
        const primaryRole = getPrimaryRole(roles);

        if (isAuthRoute) {
            // Logged in, trying to access auth route
            response = NextResponse.redirect(new URL(ROLE_HOME[primaryRole], request.url));
        } else if (matchedRoute && !matchedRoute.allowedRoles.some((r) => roles.includes(r))) {
            // Logged in, but none of their roles are allowed on this protected route
            response = NextResponse.redirect(new URL(ROLE_HOME[primaryRole], request.url));
        } else {
            response = NextResponse.next();
        }
    } else {
        response = NextResponse.next();
    }

    // Refresh thành công -> ghi token mới vào response cho mọi nhánh ở trên
    if (newTokens) {
        response.cookies.set("accessToken", newTokens.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60,
        });
    
        response.cookies.set("refreshToken", newTokens.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
        });
    }

    return response;
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
  }