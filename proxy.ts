import { NextRequest, NextResponse } from "next/server";
import { decrypt, SessionPayload } from "./lib/session";
import { SignInRoute, StudentDashboardRoute, TeacherDashboardRoute, AdminDashboardRoute, StudentRoute, TeacherRoute, AdminRoute } from "./lib/routes";
import { Role } from "./types/auth-types";

// Cấu hình các route được bảo vệ và các role được phép truy cập
const ROLE_CONFIG: Record<Role, { prefix: string; home: string }> = {
    STUDENT: { prefix: StudentRoute, home: StudentDashboardRoute },
    TEACHER: { prefix: TeacherRoute, home: TeacherDashboardRoute },
    ADMIN: { prefix: AdminRoute, home: AdminDashboardRoute }
};

const ALL_ROLES = Object.keys(ROLE_CONFIG) as Role[];

// URL này thuộc vùng của role nào?
// Trả về null nếu là trang public (landing page, /auth/...)
function getRequiredRole(pathname: string): Role | null {
    for (const role of ALL_ROLES) {
        const prefix = ROLE_CONFIG[role].prefix;

        // Khớp đúng "/teacher" hoặc "/teacher/bất-cứ-gì"
        if (pathname === prefix || pathname.startsWith(prefix + "/")) {
            return role;
        }
    }

    return null;
}

// Lấy role của user từ payload của token.
// Trả về null nếu token không có role nào hợp lệ.
function getUserRole(payload: SessionPayload): Role | null {
    const roles: Role[] = payload?.roles ?? [];

    for (const role of roles) {
        // Vì user chỉ có 1 role, gặp cái đầu tiên hợp lệ là xong
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
    const { pathname } = request.nextUrl;

    const isAuthRoute = pathname.startsWith("/auth");
    const requiredRole = getRequiredRole(pathname);

    // --- Bước 1: trang public thì cho qua luôn ---
    // Không cần biết user là ai -> khỏi giải mã token, khỏi gọi refresh
    if (!isAuthRoute && !requiredRole) {
        return NextResponse.next();
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
    // null = chưa đăng nhập, HOẶC token hợp lệ nhưng roles rỗng/lạ.
    // Hai trường hợp này xử lý giống hệt nhau nên gộp chung.
    const userRole = payload ? getUserRole(payload) : null;

    // --- Bước 5: chưa đăng nhập được -> xoá cookie cũ (đã vô nghĩa) ---
    if (!userRole) {
        let response: NextResponse;

        if (isAuthRoute) {
            // Đang tới trang sign-in để đăng nhập -> cho vào bình thường
            response = NextResponse.next();
        } else {
            // Đá về trang đăng nhập
            response = NextResponse.redirect(new URL(SignInRoute, request.url));
        }

        response.cookies.delete("accessToken");
        response.cookies.delete("refreshToken");

        return response;
    }

    // --- Bước 6: quyết định cho qua hay redirect ---
    const home = ROLE_CONFIG[userRole].home;

    let response: NextResponse;

    if (isAuthRoute) {
        // Đã đăng nhập rồi mà còn vào trang sign-in -> về dashboard
        response = NextResponse.redirect(new URL(home, request.url));
    } else if (requiredRole !== userRole) {
        // Student mà đòi vào /teacher (hoặc ngược lại) -> về dashboard của mình
        response = NextResponse.redirect(new URL(home, request.url));
    } else {
        // Đúng vùng của mình -> cho qua
        response = NextResponse.next();
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
            maxAge: 60 * 60, // 1 giờ
        });

        response.cookies.set("refreshToken", newTokens.refreshToken, {
            ...cookieOptions,
            maxAge: 7 * 24 * 60 * 60, // 7 ngày
        });
    }

    return response;
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
  }