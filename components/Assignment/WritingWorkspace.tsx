import { useAuth } from "@/contexts/auth-context";
import { useOnlineUsers } from "@/hooks/useOnlineUsers";
import { CourseMember } from "@/types/course-types";
import { AiMode, AiModel, ResponseLanguage, WritingAssignment } from "@/types/writing-assignment-types";
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
import AiAssistMenu from "./AiAssistMenu";
import { useMutation } from "@tanstack/react-query";
import { WritingAssignmentsApi } from "@/lib/api/writing-assignments-client";
import { useAppMessage } from "@/contexts/message-context";
import { applyAiCorrections, buildTextIndex, countPendingCorrections } from "@/lib/ai-corrections";
import Button from "../Button";
import FileEditIcon from "../Icons/FileEditIcon";

type WorkspaceMode = "teacher" | "student";

type PanelSize = number | string;

const SIZES_TWO_PANELS: PanelSize[] = ["50%", "50%"];
const SIZES_THREE_PANELS: PanelSize[] = ["25%", "50%", "25%"];

type RunAiVariables = {
    editor: Editor;
    essay: string;
    mode: AiMode;
    targetBand?: number;
    language: ResponseLanguage;
    model: AiModel;
};

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
    isMembersLoading = false,
}: WritingWorkspaceProps) {
    const t = useTranslations("WritingWorkspace");
    const { user } = useAuth();
    const message = useAppMessage();

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

    const { mutate, isPending, variables } = useMutation({
        mutationFn: ({ essay, mode, targetBand, language, model }: RunAiVariables) =>
            WritingAssignmentsApi.generateAiCorrections(assignmentId, { essay, mode, targetBand, language, model }),
        onSuccess: (data, { editor: targetEditor }) => {
            if (targetEditor.isDestroyed) return;

            if (data.corrections.length === 0) {
                message.info(t("aiNoCorrections"));
                return;
            }

            try {
                const { applied, skipped } = applyAiCorrections(targetEditor, data.corrections);
                message.success(t("aiApplied", { applied, skipped }));
                if (applied > 0 && !showCorrectionPanel) handleToggleCorrectionPanel(true);
            } catch (error) {
                console.error(error);
                message.error(t("errors.aiFailed"));
            }
        },
        onError: (error) => {
            message.error(error.message);
        },
    });

    const selectAiModel = (aiMode: AiMode): AiModel => {
        if (!isTeacher) return "HAIKU";
        return aiMode === "IMPROVE" ? "OPUS" : "SONNET";
    };

    const handleShowCorrections = () => {
        if (!showCorrectionPanel) handleToggleCorrectionPanel(true);
    };

    const handleRunAi = (aiMode: AiMode, language: ResponseLanguage, targetBand?: number) => {
        if (!editor || editor.isDestroyed || isPending) return;

        const pending = countPendingCorrections(editor.state.doc);
        if (pending > 0) {
            message.warning(t("errors.aiPendingCorrections", { count: pending }));
            handleShowCorrections();
            return;
        }

        const essay = buildTextIndex(editor.state.doc).text;
        if (!essay.trim()) {
            message.warning(t("errors.aiEmptyEssay"));
            return;
        }

        mutate({
            editor,
            essay,
            mode: aiMode,
            targetBand,
            language,
            model: selectAiModel(aiMode),
        });
    };

    const overdue = isOverdue(assignment.dueDate, assignment.dueTime);
    const durationMinutes = assignment.writingQuestion.taskType === "TASK_1" ? 20 : 40;

    const ownerId = selectedOwnerId ?? user?.id ?? null;
    const documentName = ownerId ? `writing:${assignmentId}:${ownerId}` : null;

    const isEditorReadOnly = !isTeacher && ownerId !== user?.id;

    const runningMode = isPending ? variables?.mode ?? null : null;

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

                <div className="flex items-center gap-3">
                    {!isMembersLoading && (
                        <MemberSwitcher
                            members={members}
                            value={ownerId}
                            currentUserId={user?.id ?? null}
                            onlineIds={onlineIds}
                            onChange={setSelectedOwnerId}
                        />
                    )}

                    <Button
                        size="sm"
                        type="button"
                        label={t("submit")}
                        icon={<FileEditIcon className="text-white" width={16} height={16}/>}
                        onClick={() => {}}
                    />
                </div>
            </div>

            <Splitter className="rounded-2xl border border-border bg-bg" onResize={setSizes}>
                <Splitter.Panel size={sizes[0]} min="20%" max={showCorrectionPanel ? "50%" : "70%"}>
                    <div className="p-6">
                        <WritingQuestionPanel question={assignment.writingQuestion} note={assignment.description}/>
                    </div>
                </Splitter.Panel>

                <Splitter.Panel size={sizes[1]} className="flex flex-col" min="30%">
                    <div className="flex flex-1 flex-col gap-3 p-6">
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                            {isTeacher && (
                                <div className="flex items-center gap-1.5">
                                    <p className="whitespace-nowrap text-muted">{t("correctionMode")}</p>
                                    <Switch
                                        checked={isCorrection}
                                        onChange={setIsCorrection}
                                        checkedChildren={t("correctionOn")}
                                        unCheckedChildren={t("correctionOff")}
                                    />
                                </div>
                            )}

                            <div className="flex items-center gap-1.5">
                                <p className="whitespace-nowrap text-muted">{t("correctionPanel")}</p>
                                <Switch
                                    checked={showCorrectionPanel}
                                    onChange={handleToggleCorrectionPanel}
                                    checkedChildren={t("correctionOn")}
                                    unCheckedChildren={t("correctionOff")}
                                />
                            </div>

                            {!isEditorReadOnly && (
                                <div className="ml-auto">
                                    <AiAssistMenu
                                        canImprove={isTeacher}
                                        runningMode={runningMode}
                                        onFix={(language) => handleRunAi("FIX", language)}
                                        onImprove={(band, language) => handleRunAi("IMPROVE", language, band)}
                                    />
                                </div>
                            )}
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