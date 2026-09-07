"use client";

import ArrowLeftIcon from "@/components/Icons/ArrowLeftIcon";
import { Link } from "@/lib/navigation";
import { TeacherCoursesRoute } from "@/lib/routes";
import { Breadcrumb } from "antd";
import { useTranslations } from "next-intl";

export default function TeacherCourseDetailLayout({ children }: { children: React.ReactNode }) {
    const t = useTranslations("TeacherCourseDetailPage");

    const breadcrumbItems = [
        {
            title: (
                <span className="group inline-flex items-center gap-1.5">
                    <ArrowLeftIcon
                        width={16}
                        height={16}
                        className="text-muted transition-colors group-hover:text-accent"
                    />
                    <span className="text-sm text-muted transition-colors group-hover:text-accent">
                        {t("breadcrumbs.courses")}
                    </span>
                </span>
            ),
            path: TeacherCoursesRoute,
        },
    ];

    return (
        <div>
            <Breadcrumb
                items={breadcrumbItems}
                itemRender={(item) =>
                    item.path ? (
                        <Link href={item.path}>{item.title}</Link>
                    ) : (
                        <span>{item.title}</span>
                    )
                }
            />

            <div className="mt-4">
                {children}
            </div>
        </div>
    );
}