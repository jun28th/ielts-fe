import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { decrypt, SessionPayload } from "./lib/session";
import { SignInRoute, StudentDashboardRoute, TeacherDashboardRoute, AdminDashboardRoute, StudentRoute, TeacherRoute, AdminRoute } from "./lib/routes";
import { Role } from "./types/auth-types";

const handleI18nRouting = createMiddleware(routing);

const ROLE_CONFIG: Record<Role, { prefix: string; home: string }> = {
    STUDENT: { prefix: StudentRoute, home: StudentDashboardRoute },
    TEACHER: { prefix: TeacherRoute, home: TeacherDashboardRoute },
    ADMIN: { prefix: AdminRoute, home: AdminDashboardRoute }
};

const ALL_ROLES = Object.keys(ROLE_CONFIG) as Role[];

// Bỏ tiền tố /en hoặc /vi trước khi so khớp route
function stripLocale(pathname: string): string {
    const match = pathname.match(/^\/(en|vi)(\/.*)?$/);
    if (!match) return pathname;
    return match[2] ?? "/";
}

function getRequiredRole(pathname: string): Role | null {
    for (const role of ALL_ROLES) {
        const prefix = ROLE_CONFIG[role].prefix;
        if (pathname === prefix || pathname.startsWith(prefix + "/")) {
            return role;
        }
    }
    return null;
}

function getUserRole(payload: SessionPayload): Role | null {
    const roles: Role[] = payload?.roles ?? [];
    for (const role of roles) {
        if (ROLE_CONFIG[role]) return role;
    }
    return null;
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
    // Bước 0: cho next-intl xử lý locale trước (thêm /en, /vi nếu thiếu, redirect nếu cần)
    const intlResponse = handleI18nRouting(request);

    const { pathname } = request.nextUrl;
    const pathWithoutLocale = stripLocale(pathname);
    const locale = pathname.match(/^\/(en|vi)/)?.[1] ?? routing.defaultLocale;

    const isAuthRoute = pathWithoutLocale.startsWith("/auth");
    const requiredRole = getRequiredRole(pathWithoutLocale);

    // --- Bước 1: trang public -> để nguyên response của next-intl ---
    if (!isAuthRoute && !requiredRole) {
        return intlResponse;
    }

    // --- Bước 2: đọc accessToken từ cookie ---
    const accessToken = request.cookies.get('accessToken')?.value;
    let payload = await decrypt(accessToken);

    // --- Bước 3: accessToken hỏng/hết hạn -> thử refresh ---
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

    // --- Bước 4: xác định role của user ---
    const userRole = payload ? getUserRole(payload) : null;

    // --- Bước 5: chưa đăng nhập được ---
    if (!userRole) {
        let response: NextResponse;

        if (isAuthRoute) {
            response = intlResponse;
        } else {
            response = NextResponse.redirect(new URL(`/${locale}${SignInRoute}`, request.url));
        }

        response.cookies.delete("accessToken");
        response.cookies.delete("refreshToken");

        return response;
    }

    // --- Bước 6: quyết định cho qua hay redirect ---
    const home = ROLE_CONFIG[userRole].home;

    let response: NextResponse;

    if (isAuthRoute) {
        response = NextResponse.redirect(new URL(`/${locale}${home}`, request.url));
    } else if (requiredRole !== userRole) {
        response = NextResponse.redirect(new URL(`/${locale}${home}`, request.url));
    } else {
        response = intlResponse;
    }

    // --- Bước 7: nếu vừa refresh thành công thì lưu token mới ---
    if (newTokens) {
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict" as const,
            path: "/",
        };

        response.cookies.set("accessToken", newTokens.accessToken, {
            ...cookieOptions,
            maxAge: 60 * 60,
        });

        response.cookies.set("refreshToken", newTokens.refreshToken, {
            ...cookieOptions,
            maxAge: 7 * 24 * 60 * 60,
        });
    }

    return response;
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}