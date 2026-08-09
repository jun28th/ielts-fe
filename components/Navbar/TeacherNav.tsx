"use client";

import { Link, usePathname } from "@/lib/navigation";
import { 
    TeacherCoursesRoute, 
    TeacherDashboardRoute, 
    TeacherQuestionBankListeningRoute, 
    TeacherQuestionBankReadingRoute, 
    TeacherQuestionBankRoute, 
    TeacherQuestionBankSpeakingRoute, 
    TeacherQuestionBankWritingRoute, 
    TeacherStudentsRoute 
} from "@/lib/routes";
import { Menu, MenuProps } from "antd";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

type MenuItem = Required<MenuProps>['items'][number];

const QUESTION_BANK_ITEMS = [
	{ href: TeacherQuestionBankListeningRoute, labelKey: "listening" },
	{ href: TeacherQuestionBankReadingRoute, labelKey: "reading" },
	{ href: TeacherQuestionBankWritingRoute, labelKey: "writing" },
	{ href: TeacherQuestionBankSpeakingRoute, labelKey: "speaking" },
] as const;

// Lấy danh sách các route con (leaf routes) từ QUESTION_BANK_ITEMS và các route khác
const LEAF_ROUTES = [
	TeacherDashboardRoute,
	TeacherCoursesRoute,
	TeacherStudentsRoute,
	...QUESTION_BANK_ITEMS.map((i) => i.href),
].sort((a, b) => b.length - a.length);

export default function TeacherNav() {
    const pathname = usePathname();
    const t = useTranslations("TeacherNav");

    const [openKeys, setOpenKeys] = useState<string[]>([]);

    const items: MenuItem[] = [
        {
            key: TeacherDashboardRoute,
            label: (
                <Link href={TeacherDashboardRoute} replace>
                    {t("dashboard")}
                </Link>
            ),
        },
        {
            key: TeacherCoursesRoute,
            label: (
                <Link href={TeacherCoursesRoute} replace>
                    {t("courses")}
                </Link>
            ),
        },
		{
			key: TeacherQuestionBankRoute,
			label: t("questionBank"),
			children: QUESTION_BANK_ITEMS.map((item) => ({
				key: item.href,
				label: (
					<Link href={item.href} replace>
						{t(`questionBankItems.${item.labelKey}`)}
					</Link>
				),
			})),
		},
        {
            key: TeacherStudentsRoute,
            label: (
                <Link href={TeacherStudentsRoute} replace>
                    {t("students")}
                </Link>
            ),
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