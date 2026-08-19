import { AdminAccessControlRoute, AdminDashboardRoute } from "@/lib/routes";
import { Link } from "@/lib/navigation";
import { usePathname } from "@/lib/navigation"; 
import { Menu, MenuProps } from "antd";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

type MenuItem = Required<MenuProps>['items'][number];

const LEAF_ROUTES = [
    AdminDashboardRoute,
    AdminAccessControlRoute,
].sort((a, b) => b.length - a.length);

export default function AdminNav() {
    const pathname = usePathname();
    const t = useTranslations("AdminNav");

    const [openKeys, setOpenKeys] = useState<string[]>([]);

    const items: MenuItem[] = [
        {
            key: AdminDashboardRoute,
            label: (
                <Link href={AdminDashboardRoute} replace>
                    {t("dashboard")}
                </Link>
            ),
        },
        {
            key: AdminAccessControlRoute,
            label: (
                <Link href={AdminAccessControlRoute} replace>
                    {t("accessControl")}
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