import { useAuth } from "@/contexts/auth-context";
import { useOnlineUsers } from "@/hooks/useOnlineUsers";
import { CourseMember } from "@/types/course-types";
import { WritingAssignment } from "@/types/writing-assignment-types";
import { useTranslations } from "next-intl";
import { useState } from "react";
import type { Editor } from "@tiptap/react";
import { formatDayMonth, formatTime, isOverdue } from "@/lib/utils";
import { Splitter, Switch } from "antd";
import WritingQuestionPanel from "./WritingQuestionPanel";
import MemberSwitcher from "./MemberSwitcher";
import CountdownTimer from "./CountdownTimer";
import WritingEditor from "./WritingEditor";
import CorrectionPanel from "./CorrectionPanel";

type WorkspaceMode = "teacher" | "student";

type PanelSize = number | string;

const SIZES_TWO_PANELS: PanelSize[] = ["50%", "50%"];
const SIZES_THREE_PANELS: PanelSize[] = ["30%", "45%", "25%"];

type WritingWorkspaceProps = {
    mode: WorkspaceMode;
    assignmentId: string;
    assignment: WritingAssignment;
    members: CourseMember[];
    isMembersLoading?: boolean;
};

export default function WritingWorkspace({ 
    mode, 
    assignmentId, 
    assignment, 
    members, 
    isMembersLoading = false 
} : WritingWorkspaceProps) {
    const t = useTranslations("WritingWorkspace");
    const { user } = useAuth();

    const isTeacher = mode === "teacher";

    const [selectedOwnerId, setSelectedOwnerId] = useState<string | null>(null);
    const [isCorrection, setIsCorrection] = useState<boolean>(false);
    const [showCorrectionPanel, setShowCorrectionPanel] = useState<boolean>(false);
    const [sizes, setSizes] = useState<PanelSize[]>(SIZES_TWO_PANELS);
    const [editor, setEditor] = useState<Editor | null>(null);

    const onlineIds = useOnlineUsers(assignmentId, user?.id ?? null);

    const handleToggleCorrectionPanel = (checked: boolean) => {
        setShowCorrectionPanel(checked);
        setSizes(checked ? SIZES_THREE_PANELS : SIZES_TWO_PANELS);
    };

    const overdue = isOverdue(assignment.dueDate, assignment.dueTime);
    const durationMinutes = assignment.writingQuestion.taskType === "TASK_1" ? 20 : 40;

    const ownerId = selectedOwnerId ?? user?.id ?? null;
    const documentName = ownerId ? `writing:${assignmentId}:${ownerId}` : null;

    const isEditorReadOnly = !isTeacher && ownerId !== user?.id;

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
                            {isTeacher && (
                                <div className="flex items-center gap-2">
                                    <p className="text-muted">{t("correctionMode")}</p>
                                    <Switch
                                        checked={isCorrection}
                                        onChange={setIsCorrection}
                                        checkedChildren={t("correctionOn")}
                                        unCheckedChildren={t("correctionOff")}
                                    />
                                </div>
                            )}

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
                                readOnly={isEditorReadOnly}
                                isCorrection={isTeacher && isCorrection}
                                onEditorChange={setEditor}
                            />
                        )}
                    </div>
                </Splitter.Panel>

                {showCorrectionPanel && (
                    <Splitter.Panel size={sizes[2]} min="20%" max="40%">
                        <div className="relative h-full">
                            <div className="absolute inset-0 flex flex-col p-6">
                                <CorrectionPanel 
                                    editor={editor} 
                                    readOnly={isEditorReadOnly} 
                                    canEdit={isTeacher}
                                />
                            </div>
                        </div>
                    </Splitter.Panel>
                )}
            </Splitter>
        </div>
    );
}