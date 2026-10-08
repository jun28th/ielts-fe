"use client";

import ArrowLeftIcon from "@/components/Icons/ArrowLeftIcon";
import { Link } from "@/lib/navigation";
import { StudentCourseDetailRoute, StudentCoursesRoute, StudentWritingAssignmentRoute } from "@/lib/routes";
import { Breadcrumb } from "antd";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

export default function StudentCourseDetailLayout({ children }: { children: React.ReactNode }) {
    const { courseId, assignmentId } = useParams<{ courseId: string; assignmentId?: string }>();

    const t = useTranslations("StudentCourseDetailPage");

    const breadcrumbItems = [
        {
            title: t("breadcrumbs.courses"),
            path: StudentCoursesRoute,
        },
        {
            title: t("breadcrumbs.detail"),
            path: StudentCourseDetailRoute(courseId)
        }
    ];

    if (assignmentId) {
        breadcrumbItems.push({
            title: t("breadcrumbs.writingAssignment"),
            path: StudentWritingAssignmentRoute(courseId, assignmentId),
        });
    }

    return (
        <>
            <Breadcrumb
                items={breadcrumbItems}
                itemRender={(currentRoute) => {
                    const isFirst = currentRoute.path === breadcrumbItems[0].path;
                    const isLast = currentRoute.path === breadcrumbItems[breadcrumbItems.length - 1].path;

                    const content = (
                        <span className="group inline-flex items-center gap-1.5">
                            {isFirst && (
                                <ArrowLeftIcon width={16} height={16} className="text-muted transition-colors group-hover:text-accent" />
                            )}
                            <span>{currentRoute.title}</span>
                        </span>
                    );

                    return isLast ? (
                        <>{content}</>
                    ) : (
                        <Link href={currentRoute.path as string} replace>{content}</Link>
                    );
                }}
            />

            <div className="mt-4">
                {children}
            </div>
        </>
    );
}