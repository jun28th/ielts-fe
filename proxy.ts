import { cookies } from "next/headers";
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

export default async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const isAuthRoute = pathname.startsWith("/auth");
    const matchedRoute = PROTECTED_ROUTES.find((route) =>
        pathname.startsWith(route.prefix)
    );

    const accessToken = (await cookies()).get('accessToken')?.value;
    const payload = await decrypt(accessToken);

    // Not logged in, trying to access protected route
    if (matchedRoute && !payload) {
        return NextResponse.redirect(new URL(SignInRoute, request.url));
    }

    if (payload) {
        const roles = (payload.roles as Role[]) ?? [];
        const primaryRole = getPrimaryRole(roles);

        // Logged in, trying to access auth route
        if (isAuthRoute) {
            return NextResponse.redirect(new URL(ROLE_HOME[primaryRole], request.url));
        }

        // Logged in, but none of their roles are allowed on this protected route
        if (matchedRoute) {
            const hasAccess = matchedRoute.allowedRoles.some((r) => roles.includes(r));

            if (!hasAccess) {
                return NextResponse.redirect(new URL(ROLE_HOME[primaryRole], request.url));
            }
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/student/:path*", 
        "/teacher/:path*", 
        "/admin/:path*", 
        "/auth/:path*"
    ],
};