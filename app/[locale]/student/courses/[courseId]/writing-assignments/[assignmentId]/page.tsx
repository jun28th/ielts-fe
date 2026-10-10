"use client";

import CountdownTimer from "@/components/Assignment/CountdownTimer";
import WritingEditor from "@/components/Assignment/WritingEditor";
import WritingQuestionPanel from "@/components/Assignment/WritingQuestionPanel";
import { WritingAssignmentsApi } from "@/lib/api/writing-assignments-client";
import { formatDayMonth, formatTime, isOverdue } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Splitter } from "antd";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

export default function StudentWritingAssignmentPage() {
    const { assignmentId } = useParams<{ assignmentId: string }>();
    const t = useTranslations("StudentWritingAssignmentPage");

    const { data: assignment, isLoading, error } = useQuery({
        queryKey: ["assignment", assignmentId],
        queryFn: () => WritingAssignmentsApi.getWritingAssignment(assignmentId),
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

    const overdue = isOverdue(assignment.dueDate, assignment.dueTime);
    const durationMinutes = assignment.writingQuestion.taskType === "TASK_1" ? 20 : 40;

    return (
        <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-3">
                <p className="text-sm">
                    <span className="font-medium text-muted">{t("dueLabel")}: </span>
                    <span className={overdue ? "text-error" : "text-fg"}>
                        {formatTime(assignment.dueTime)} - {formatDayMonth(assignment.dueDate)}
                    </span>
                    {overdue && (
                        <span className="ml-2 font-medium text-error">{t("overdue")}</span>
                    )}
                </p>
                <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium text-muted">{t("timeLimitLabel")}:</span>
                    <CountdownTimer
                        storageKey={assignmentId}
                        durationMinutes={durationMinutes}
                        onExpire={() => {}}
                    />
                </div>
            </div>

            <Splitter className="rounded-2xl border border-border bg-bg">
                <Splitter.Panel defaultSize="50%" min="30%" max="70%">
                    <div className="p-6">
                        <WritingQuestionPanel question={assignment.writingQuestion} />
                    </div>
                </Splitter.Panel>
                <Splitter.Panel className="flex flex-col">
                    <div className="flex flex-1 flex-col p-6">
                        <WritingEditor />
                    </div>
                </Splitter.Panel>
            </Splitter>
        </div>
    );
}