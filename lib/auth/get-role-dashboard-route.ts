import { User } from "@/types/auth-types";
import { AdminDashboardRoute, LandingPageRoute, StudentDashboardRoute, TeacherDashboardRoute } from "../routes";

export default function getRoleDashboardRoute(user: User | null) {
    if (!user) return LandingPageRoute;
    if (user.roles.includes("ADMIN")) return AdminDashboardRoute;
    if (user.roles.includes("TEACHER")) return TeacherDashboardRoute;
    return StudentDashboardRoute;
}