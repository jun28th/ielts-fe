import { User } from "@/types/auth-types";
import { AdminDashboardRoute, StudentDashboardRoute, TeacherDashboardRoute } from "../routes";

export default function getRoleDashboardRoute(user: User) {
    if (user.roles.includes("ADMIN")) return AdminDashboardRoute;
    if (user.roles.includes("TEACHER")) return TeacherDashboardRoute;
    return StudentDashboardRoute;
}