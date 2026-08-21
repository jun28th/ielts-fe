import { useAuth } from "@/contexts/auth-context";
import { RoleName } from "@/types/role-type";
import StudentNav from "./StudentNav";
import TeacherNav from "./TeacherNav";
import AdminNav from "./AdminNav";

const NAV_BY_ROLE: Record<RoleName, React.ComponentType> = {
    STUDENT: StudentNav,
    TEACHER: TeacherNav,
    ADMIN: AdminNav,
};

export default function RoleNav() {
    const { user } = useAuth();

    if (!user) return null;

    const role = user.roles.find((r) => NAV_BY_ROLE[r]);
    if (!role) return null;

    const Nav = NAV_BY_ROLE[role];

    return <Nav />;
}