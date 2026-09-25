"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import Button from "../Button";
import CheckBoxIcon from "../Icons/CheckBoxIcon";
import PlusIcon from "../Icons/PlusIcon";
import { Course } from "@/types/course-types";
import { useAppMessage } from "@/contexts/message-context";
import { useQueryClient } from "@tanstack/react-query";
import CreateWeekSectionModal from "../Modal/CreateWeekSectionModal";
import WeekSectionCard from "./WeekSectionCard";

type WeekSectionProps = {
    course: Course;
};

export default function WeekSection({ course }: WeekSectionProps) {
    const t = useTranslations("TeacherCourseDetailPage.WeekSection");
    const message = useAppMessage();
    const queryClient = useQueryClient();

    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
                <p className="text-xl font-bold text-fg">{t("title")}</p>
                <div className="flex gap-2">
                    <Button
                        variant="tertiary"
                        label={t("gradeButton")}
                        icon={<CheckBoxIcon className="text-accent" width={20} height={20}/>}
                    />

                    <Button
                        variant="primary"
                        label={t("createButton")}
                        icon={<PlusIcon className="text-white" width={20} height={20}/>}
                        onClick={() => setIsCreateModalOpen(true)}
                    />
                </div>
            </div>

            <div className="flex flex-col gap-3">
                {course.weekSections.map((weekSection) => (
                    <WeekSectionCard
                        key={weekSection.id}
                        courseId={course.id}
                        weekSection={weekSection}
                    />
                ))}
            </div>

            <CreateWeekSectionModal 
                course={course}
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />
        </div>
    );
}