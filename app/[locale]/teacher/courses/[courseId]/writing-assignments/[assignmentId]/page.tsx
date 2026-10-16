"use client";

import CorrectionPanel from "@/components/Assignment/CorrectionPanel";
import CountdownTimer from "@/components/Assignment/CountdownTimer";
import MemberSwitcher from "@/components/Assignment/MemberSwitcher";
import WritingEditor from "@/components/Assignment/WritingEditor";
import WritingQuestionPanel from "@/components/Assignment/WritingQuestionPanel";
import { useAuth } from "@/contexts/auth-context";
import { useOnlineUsers } from "@/hooks/useOnlineUsers";
import { coursesApi } from "@/lib/api/courses-client";
import { WritingAssignmentsApi } from "@/lib/api/writing-assignments-client";
import { formatDayMonth, formatTime, isOverdue } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Splitter, Switch } from "antd";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useState } from "react";

type PanelSize = number | string;

const SIZES_TWO_PANELS: PanelSize[] = ["50%", "50%"];
const SIZES_THREE_PANELS: PanelSize[] = ["30%", "45%", "25%"];

export default function TeacherWritingAssignmentPage() {
    const { courseId, assignmentId } = useParams<{ courseId: string; assignmentId: string }>();
    const t = useTranslations("TeacherWritingAssignmentPage");
    const { user } = useAuth();

    const [selectedOwnerId, setSelectedOwnerId] = useState<string | null>(null);
    const [isCorrection, setIsCorrection] = useState<boolean>(false);
    const [showCorrectionPanel, setShowCorrectionPanel] = useState<boolean>(false);
    const [sizes, setSizes] = useState<PanelSize[]>(SIZES_TWO_PANELS);

    const { data: assignment, isLoading, error } = useQuery({
        queryKey: ["assignment", assignmentId],
        queryFn: () => WritingAssignmentsApi.getWritingAssignment(assignmentId),
    });

    const { data: members = [], isLoading: isMembersLoading } = useQuery({
        queryKey: ["course-members", courseId],
        queryFn: () => coursesApi.getCourseMembers(courseId),
        enabled: !!courseId,
    });

    const onlineIds = useOnlineUsers(assignmentId, user?.id ?? null);

    const handleToggleCorrectionPanel = (checked: boolean) => {
        setShowCorrectionPanel(checked);
        setSizes(checked ? SIZES_THREE_PANELS : SIZES_TWO_PANELS);
    };

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

    const ownerId = selectedOwnerId ?? user?.id ?? null;
    const documentName = ownerId ? `writing:${assignmentId}:${ownerId}` : null;

    return (
        <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
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

                {!isMembersLoading && (
                    <MemberSwitcher
                        members={members}
                        value={ownerId}
                        currentUserId={user?.id ?? null}
                        onlineIds={onlineIds}
                        onChange={setSelectedOwnerId}
                    />
                )}
            </div>

            <Splitter className="rounded-2xl border border-border bg-bg" onResize={setSizes}>
                <Splitter.Panel size={sizes[0]} min="20%" max={showCorrectionPanel ? "50%" : "70%"}>
                    <div className="p-6">
                        <WritingQuestionPanel question={assignment.writingQuestion} />
                    </div>
                </Splitter.Panel>

                <Splitter.Panel size={sizes[1]} className="flex flex-col" min="30%">
                    <div className="flex flex-1 flex-col gap-3 p-6">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                <p className="text-muted">{t("correctionMode")}</p>
                                <Switch
                                    checked={isCorrection}
                                    onChange={setIsCorrection}
                                    checkedChildren={t("correctionOn")}
                                    unCheckedChildren={t("correctionOff")}
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <p className="text-muted">{t("correctionPanel")}</p>
                                <Switch
                                    checked={showCorrectionPanel}
                                    onChange={handleToggleCorrectionPanel}
                                    checkedChildren={t("correctionOn")}
                                    unCheckedChildren={t("correctionOff")}
                                />
                            </div>
                        </div>

                        {user && documentName && (
                            <WritingEditor 
                                key={documentName}
                                documentName={documentName} 
                                currentUser={{ id: user.id, name: user.fullName }}
                                isCorrection={isCorrection}
                            />
                        )}
                    </div>
                </Splitter.Panel>

                {showCorrectionPanel && (
                    <Splitter.Panel size={sizes[2]} min="20%" max="40%">
                        <div className="p-6">
                            <CorrectionPanel />
                        </div>
                    </Splitter.Panel>
                )}
            </Splitter>
        </div>
    );
}