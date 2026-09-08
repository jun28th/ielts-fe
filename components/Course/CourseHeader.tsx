"use client";

import { Course, CourseStatus } from "@/types/course-type";
import { Progress } from "antd";
import { useTranslations } from "next-intl";
import PencilIcon from "../Icons/PencilIcon";
import Button from "../Button";
import TrashIcon from "../Icons/TrashIcon";
import UpdateCourseModal from "../Modal/UpdateCourseModal";
import { useState } from "react";
import { formatDateDDMMYYYY } from "@/lib/utils";

const STATUS_STYLE: Record<CourseStatus, string> = {
    UPCOMING: "bg-accent-bg text-accent-active",
    ACTIVE: "bg-success-bg text-success",
    ENDED: "bg-surface text-muted border border-border",
};

type CourseHeaderProps = {
    course: Course;
};

export default function CourseHeader({ course }: CourseHeaderProps) {
    const t = useTranslations("TeacherCourseDetailPage");

    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);

    const percentFill = (1 / course.maxStudents) * 100;

    return (
        <div className="rounded-2xl border border-border bg-bg p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <p className="font-serif text-2xl font-bold">{course.name}</p>

                <div className="flex flex-none items-center gap-2">
                    <p className={`inline-flex h-7 flex-none items-center whitespace-nowrap rounded-full px-3 text-xs font-medium ${STATUS_STYLE[course.status]}`}>
                        {t(`status.${course.status}`)}
                    </p>

                    <Button
                        label=""
                        type="button"
                        variant="secondary"
                        icon={<PencilIcon width={18} height={18} />}
                        iconOnly={true}
                        onClick={() => setIsUpdateModalOpen(true)}
                    />

                    <Button
                        label=""
                        type="button"
                        variant="danger"
                        icon={<TrashIcon width={18} height={18} />}
                        iconOnly={true}
                    />  
                </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-x-8 gap-y-4 border-t border-border pt-5">
                <div className="min-w-30">
                    <p className="text-xs text-muted">{t("startDateLabel")}</p>
                    <p className="mt-0.5 text-sm font-semibold">{formatDateDDMMYYYY(course.startDate)}</p>
                </div>
                <div className="min-w-30">
                    <p className="text-xs text-muted">{t("sessionsLabel")}</p>
                    <p className="mt-0.5 text-sm font-semibold">{course.totalSessions}</p>
                </div>
                <div className="min-w-30">
                    <p className="text-xs text-muted">{t("scheduledWeeksLabel")}</p>
                    <p className="mt-0.5 text-sm font-semibold">1</p>
                </div>
            </div>

            <div className="mt-5 flex flex-col gap-1.5 border-t border-border pt-5">
                <div className="flex justify-between">
                    <p className="text-muted text-sm">{t("capacityLabel")}</p>
                    <div className="flex items-center gap-1 text-sm font-bold">
                        <p>1</p>
                        <p> / </p>
                        <p>{t("capacityValue", { min: course.minStudents, max: course.maxStudents })}</p>
                    </div>
                </div>
                <Progress percent={percentFill} showInfo={false} />
            </div>

            <UpdateCourseModal
                course={course}
                isOpen={isUpdateModalOpen}
                onClose={() => setIsUpdateModalOpen(false)}
            />
        </div>
    );
}