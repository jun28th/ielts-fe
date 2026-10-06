import { StudentCoursesRoute, StudentDashboardRoute } from "@/lib/routes";
import { Link } from "@/lib/navigation";
import { usePathname } from "@/lib/navigation"; 
import { useTranslations } from "next-intl";
import { Menu, MenuProps } from "antd";
import { useMemo, useState } from "react";

type MenuItem = Required<MenuProps>['items'][number];

const LEAF_ROUTES = [
    StudentDashboardRoute,
    StudentCoursesRoute,
].sort((a, b) => b.length - a.length);

export default function StudentNav() {
    const t = useTranslations("Header.studentNav");
    const pathname = usePathname();

    const [openKeys, setOpenKeys] = useState<string[]>([]);

    const items: MenuItem[] = [
        {
            key: StudentDashboardRoute,
            label: (
                <Link href={StudentDashboardRoute} replace>
                    {t("dashboard")}
                </Link>
            ),
        },
        {
            key: StudentCoursesRoute,
            label: (
                <Link href={StudentCoursesRoute} replace>
                    {t("courses")}
                </Link>
            )
        }
    ];
    
    const selectedKeys = useMemo(() => {
        const match = LEAF_ROUTES.find(
            (href) => pathname === href || pathname.startsWith(href + "/")
        );
        return match ? [match] : [];
    }, [pathname]);

    return (
        <Menu
            mode="horizontal"
            items={items}
            selectedKeys={selectedKeys}
            openKeys={openKeys}
            onOpenChange={(keys) => setOpenKeys(keys as string[])}
            onClick={() => setOpenKeys([])}
            disabledOverflow
        />
    );
}