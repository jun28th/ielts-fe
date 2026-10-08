"use client";

import { WritingAssignmentApi } from "@/lib/api/writing-assignments-client";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

export default function StudentWritingAssignmentPage() {
    const { assignmentId } = useParams<{ assignmentId: string }>();

    const { data: assignment, isLoading, error: courseError } = useQuery({
        queryKey: ["assignment", assignmentId],
        queryFn: () => WritingAssignmentApi.getWritingAssignment(assignmentId),
    });

    return (
        <>

        </>
    );
}