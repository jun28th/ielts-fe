import { WritingAssignment } from "@/types/writing-assignment-types";
import { DIFFICULTY_COLORS, TASK_TYPE_COLORS } from "@/types/writing-question-types";
import { formatDayMonth, formatTime, isOverdue } from "@/lib/utils";
import { Image, Listy, Popconfirm, Tag, Tooltip, Typography } from "antd";
import { useTranslations } from "use-intl";
import Button from "../Button";
import PencilIcon from "../Icons/PencilIcon";
import TrashIcon from "../Icons/TrashIcon";
import { useState } from "react";
import UpdateWritingAssignmentModal from "../Modal/UpdateWritingAssignmentModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppMessage } from "@/contexts/message-context";
import { writingAssignmentsApi } from "@/lib/api/writing-assignments-client";

const THUMB_SIZE = 64;

type AssignmentListProps = {
    courseId: string;
    weekSectionId: string;
    writingAssignments: WritingAssignment[];
}

export default function AssignmentList({ courseId, weekSectionId, writingAssignments } : AssignmentListProps) {
    const t = useTranslations("TeacherCourseDetailPage.WeekSectionCard.assignments");
    const message = useAppMessage();
    const queryClient = useQueryClient();

    const [isUpdateAssignmentModalOpen, setIsUpdateAssignmentModalOpen] = useState<boolean>(false);
    const [selectedAssignment, setSelectedAssignment] = useState<WritingAssignment | null>(null);

    const { mutateAsync } = useMutation({
        mutationFn: (assignmentId: string) => writingAssignmentsApi.delete(courseId, weekSectionId, assignmentId),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["course", courseId] });
            message.success(t("deleteSuccess"));
        },
        onError: (error) => {
            message.error(error.message);
        }
    });

    return (
        <>
            <Listy<WritingAssignment>
                items={writingAssignments}
                rowKey={"id"}
                classNames={{ root: "rounded-lg border border-border" }}
                itemRender={(assignment) => {
                    const question = assignment.writingQuestion;
                    const overdue = isOverdue(assignment.dueDate, assignment.dueTime);
                    const hasNote = assignment.description?.trim() ? true : false;

                    return (
                        <div className="flex min-w-0 items-start gap-3">
                            <div
                                className="shrink-0 overflow-hidden rounded-md bg-gray-100"
                                style={{ width: THUMB_SIZE, height: THUMB_SIZE }}
                            >
                                {question.imageUrl ? (
                                    <Image
                                        src={question.imageUrl}
                                        alt={question.title}
                                        width={THUMB_SIZE}
                                        height={THUMB_SIZE}
                                        style={{ objectFit: "cover" }}
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-sm text-muted">
                                        —
                                    </div>
                                )}
                            </div>

                            <div className="flex min-w-0 flex-1 flex-col gap-1">
                                <Tooltip
                                    placement="topLeft"
                                    title={<span className="whitespace-pre-line">{question.prompt}</span>}
                                >
                                    <div className="flex min-w-0 flex-col gap-1">
                                        <p className="truncate text-sm font-medium text-fg">{question.title}</p>
                                        <p className="truncate text-sm text-muted">{question.prompt}</p>
                                    </div>
                                </Tooltip>

                                <div className="mt-1 flex items-center gap-1.5">
                                    <Tag variant="filled" color={TASK_TYPE_COLORS[question.taskType]} style={{ marginInlineEnd: 0, fontSize: 14 }}>
                                        {t(`taskType.${question.taskType}`)}
                                    </Tag>
                                    <Tag variant="filled" color={DIFFICULTY_COLORS[question.difficulty]} style={{ marginInlineEnd: 0, fontSize: 14 }}>
                                        {t(`difficulty.${question.difficulty}`)}
                                    </Tag>
                                </div>

                                {hasNote ? (
                                    <Typography.Paragraph
                                        className="mt-1 text-sm text-muted"
                                        style={{ marginBottom: 0, whiteSpace: "pre-line", wordBreak: "break-word" }}
                                        ellipsis={{ 
                                            rows: 2, 
                                            expandable: "collapsible", 
                                            symbol: (expanded) => expanded ? t("showLess") : t("showMore")
                                        }}
                                    >
                                        <span className="font-medium text-muted">{t("noteLabel")}: </span>
                                        {assignment.description}
                                    </Typography.Paragraph>
                                ) : (
                                    <p className="mt-1 text-sm text-muted">
                                        <span className="font-medium">{t("noteLabel")}: </span>
                                        {t("noNote")}
                                    </p>
                                )}

                                <p className="text-sm">
                                    <span className="font-medium text-muted">{t("dueLabel")}: </span>
                                    <span className={overdue ? "text-error" : "text-fg"}>
                                        {formatTime(assignment.dueTime)} - {formatDayMonth(assignment.dueDate)}
                                    </span>
                                    {overdue && (
                                        <span className="ml-2 font-medium text-error">{t("overdue")}</span>
                                    )}
                                </p>
                            </div>

                            <div className="flex flex-none items-center gap-2">
                                <Button
                                    label=""
                                    type="button"
                                    variant="secondary"
                                    icon={<PencilIcon width={18} height={18} />}
                                    iconOnly={true}
                                    onClick={() => {
                                        setSelectedAssignment(assignment);
                                        setIsUpdateAssignmentModalOpen(true);
                                    }}
                                />

                                <Popconfirm
                                    title={t("deletePopconfirm.title")}
                                    description={t("deletePopconfirm.subtitle")}
                                    placement="bottomRight"
                                    okText={t("deletePopconfirm.okText")}
                                    cancelText={t("deletePopconfirm.cancelText")}
                                    okButtonProps={{ style: { cursor: "pointer" } }}
                                    cancelButtonProps={{ style: { cursor: "pointer" } }}
                                    onConfirm={() => mutateAsync(assignment.id).catch(() => {})}                                
                                >
                                    <button
                                        type="button"
                                        className="inline-flex h-8 w-8 flex-none items-center justify-center rounded-lg border border-border bg-bg text-muted transition-colors cursor-pointer hover:border-error hover:bg-error-bg hover:text-error"
                                    >
                                        <TrashIcon width={18} height={18} />
                                    </button>
                                </Popconfirm>
                            </div>
                        </div>
                    )
                }}
            />

            {selectedAssignment && (
                <UpdateWritingAssignmentModal
                    courseId={courseId}
                    weekSectionId={weekSectionId}
                    assignment={selectedAssignment}
                    isOpen={isUpdateAssignmentModalOpen}
                    onClose={() => {
                        setSelectedAssignment(null);
                        setIsUpdateAssignmentModalOpen(false);
                    }}
                />
            )}
        </>
    )
}