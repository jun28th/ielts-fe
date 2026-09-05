"use client";

import Button from "@/components/Button";
import CourseCard from "@/components/Course/CourseCard";
import PlusIcon from "@/components/Icons/PlusIcon";
import CreateCourseModal from "@/components/Modal/CreateCourseModal";
import { coursesApi } from "@/lib/api/courses-client";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useState } from "react";

export default function CoursesPage() {
    const t = useTranslations("TeacherCoursesPage");
    
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const { data: courses, isLoading, error } = useQuery({
        queryKey: ["courses"],
        queryFn: coursesApi.list,
    });

    return (
        <>
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-serif font-bold text-2xl mb-1">
                        {t("title")}
					</h1>
					<p className="text-muted text-sm">
                        {t("subtitle")}
                    </p>
                </div>

                <Button
                    variant="primary"
                    label={t("createButton")}
                    icon={<PlusIcon className="text-white" width={20} height={20}/>}
                    onClick={() => setIsOpen(true)}
                />
            </div>

            <div className="mt-6">
                {isLoading && (
                    <div className="grid grid-cols-1 gap-4.5 md:grid-cols-2 lg:grid-cols-3">
                        {[0, 1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="h-44 animate-pulse rounded-2xl border border-border bg-surface" />
                        ))}
                    </div>
                )}

                {error && (
                    <div className="rounded-2xl border border-error/40 bg-error-bg px-6 py-10 text-center text-sm text-error">
                        {error.message}
                    </div>
                )}

                {courses && (
                    <div className="grid grid-cols-1 gap-4.5 md:grid-cols-2 lg:grid-cols-3">
                        {courses.map((course) => (
                            <CourseCard key={course.id} course={course} />
                        ))}
                    </div>
                )}
            </div>

            <CreateCourseModal isOpen={isOpen} onClose={() => setIsOpen(false)}/>
        </>
    )
}