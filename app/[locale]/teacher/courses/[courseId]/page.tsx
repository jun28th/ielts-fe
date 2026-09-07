"use client";

import CourseHeader from "@/components/Course/CourseHeader";
import { coursesApi } from "@/lib/api/courses-client";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

export default function CourseDetailPage() {
    const { courseId } = useParams<{ courseId: string }>();

    const { data: course, isLoading: isCourseLoading, error: courseError } = useQuery({
        queryKey: ["course", courseId],
        queryFn: () => coursesApi.get(courseId),
    });

    if (isCourseLoading) {
        return <div className="h-32 animate-pulse rounded-2xl border border-border bg-surface" />;
    }

    if (courseError) {
        return (
            <div className="rounded-2xl border border-error/40 bg-error-bg px-6 py-10 text-center text-sm text-error">
                {courseError.message}
            </div>
        );
    }

    if (!course) return null;

    return (
        <div className="flex flex-col gap-6">
            <CourseHeader course={course} />

        </div>
    );
}