"use client";

import WritingWorkspace from "@/components/Assignment/WritingWorkspace";
import { coursesApi } from "@/lib/api/courses-client";
import { WritingAssignmentsApi } from "@/lib/api/writing-assignments-client";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

export default function TeacherWritingAssignmentPage() {
    const { courseId, assignmentId } = useParams<{ courseId: string; assignmentId: string }>();

    const { data: assignment, isLoading, error } = useQuery({
        queryKey: ["assignment", assignmentId],
        queryFn: () => WritingAssignmentsApi.getWritingAssignment(assignmentId),
    });

    const { data: members = [], isLoading: isMembersLoading } = useQuery({
        queryKey: ["course-members", courseId],
        queryFn: () => coursesApi.getCourseMembers(courseId),
        enabled: !!courseId,
    });

    if (isLoading) {
        return <div className="h-32 animate-pulse rounded-2xl border border-border bg-surface" />;
    }

    if (error) {
        return (
            <div className="rounded-2xl border border-error/40 bg-error-bg px-6 py-10 text-center text-sm text-error">
                {error.message}
            </div>
        );
    }

    if (!assignment) return null;

    return (
        <WritingWorkspace
            mode="teacher"
            assignmentId={assignmentId}
            assignment={assignment}
            members={members}
            isMembersLoading={isMembersLoading}
        />
    );
}