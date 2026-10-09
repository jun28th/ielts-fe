"use client";

import Button from "@/components/Button";
import CountdownTimer from "@/components/CountdownTimer";
import ArrowLeftIcon from "@/components/Icons/ArrowLeftIcon";
import ArrowRightIcon from "@/components/Icons/ArrowRightIcon";
import WritingEditor, { Person } from "@/components/WritingEditor";
import { useAuth } from "@/contexts/auth-context";
import { WritingAssignmentsApi } from "@/lib/api/writing-assignments-client";
import { formatDayMonth, formatTime, isOverdue } from "@/lib/utils";
import { DIFFICULTY_COLORS, TASK_TYPE_COLORS } from "@/types/writing-question-types";
import { useQuery } from "@tanstack/react-query";
import { Dropdown, Image, Splitter, Tag } from "antd";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function StudentWritingAssignmentPage() {
    const { assignmentId } = useParams<{ assignmentId: string }>();
    const { user } = useAuth();
    const t = useTranslations("StudentWritingAssignmentPage");

    const { data: assignment, isLoading, error } = useQuery({
        queryKey: ["assignment", assignmentId],
        queryFn: () => WritingAssignmentsApi.getWritingAssignment(assignmentId),
    });

    const [people, setPeople] = useState<Person[]>([]); // những người đã mở assignment này (server báo về)
    const [viewingId, setViewingId] = useState<string | null>(null); // đang xem bài của ai; null = bài của mình

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

    const isTask1 = assignment.writingQuestion.taskType === "TASK_1";
    const durationMinutes = isTask1 ? 20 : 40;
    const minWords = isTask1 ? 150 : 250;

    const currentId = viewingId ?? user?.id;
    const currentIndex = people.findIndex((person) => person.id === currentId);
    const currentPerson = people[currentIndex];
    const goTo = (step: number) => {
        if (people.length < 2 || currentIndex < 0) return;
        setViewingId(people[(currentIndex + step + people.length) % people.length].id);
    };

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
                <Dropdown
                        trigger={["click"]}
                        placement="bottomRight"
                        menu={{
                            items: people.map((person) => ({
                                key: person.id,
                                label: (
                                    <span>
                                        {person.name}
                                        {person.id === user?.id && (
                                            <span className="ml-1 text-muted">({t("you")})</span>
                                        )}
                                    </span>
                                ),
                            })),
                            selectable: true,
                            selectedKeys: currentId ? [currentId] : [],
                            onClick: ({ key }) => setViewingId(key),
                        }}
                    >
                        <button
                            type="button"
                            className="inline-flex h-8 cursor-pointer items-center rounded-lg border border-border bg-bg px-3 text-sm text-fg transition-colors hover:bg-surface"
                        >
                            {t("peopleList")} ({people.length})
                        </button>
                    </Dropdown>

                    <Button
                        label=""
                        type="button"
                        variant="secondary"
                        icon={<ArrowLeftIcon width={18} height={18} />}
                        iconOnly={true}
                        onClick={() => goTo(-1)}
                    />
 
                    {/* Tên chủ bài đang xem */}
                    <span className="min-w-24 text-center text-sm font-medium text-fg">
                        {currentPerson?.name ?? "..."}
                        {currentId === user?.id && (
                            <span className="ml-1 font-normal text-muted">({t("you")})</span>
                        )}
                    </span>
 
                    <Button
                        label=""
                        type="button"
                        variant="secondary"
                        icon={<ArrowRightIcon width={18} height={18} />}
                        iconOnly={true}
                        onClick={() => goTo(1)}
                    />
                </div>
            </div>

            <Splitter className="h-[calc(100vh-12rem)] rounded-2xl border border-border bg-bg">
                <Splitter.Panel defaultSize="50%" min="30%" max="70%">
                    {/* Đề bài */}
                    <div className="flex h-full flex-col gap-4 overflow-y-auto p-6">
                        <div className="flex items-center gap-1.5">
                            <Tag variant="filled" color={TASK_TYPE_COLORS[assignment.writingQuestion.taskType]} style={{ marginInlineEnd: 0, fontSize: 14 }}>
                                {t(`taskType.${assignment.writingQuestion.taskType}`)}
                            </Tag>
                            <Tag variant="filled" color={DIFFICULTY_COLORS[assignment.writingQuestion.difficulty]} style={{ marginInlineEnd: 0, fontSize: 14 }}>
                                {t(`difficulty.${assignment.writingQuestion.difficulty}`)}
                            </Tag>
                        </div>
 
                        <p className="text-lg font-semibold text-fg">{t("titleLabel")}</p>
 
                        <p className="text-sm text-muted">
                            {`You should spend about ${durationMinutes} minutes on this task. Write at least ${minWords} words.`}
                        </p>
 
                        <div className="whitespace-pre-line rounded-xl bg-surface p-4 leading-relaxed text-fg">
                            {assignment.writingQuestion.prompt}
                        </div>
 
                        <p className="text-sm text-muted">
                            {isTask1
                                ? "Summarise the information by selecting and reporting the main features, and make comparisons where relevant."
                                : "Give reasons for your answer and include any relevant examples from your own knowledge or experience."}
                        </p>

                        {isTask1 && assignment.writingQuestion.imageUrl && (
                            <Image
                                src={assignment.writingQuestion.imageUrl}
                                alt={""}
                                className="rounded-xl border border-border"
                                style={{ width: "100%", height: "auto" }}
                            />
                        )}
                    </div>
                </Splitter.Panel>
                <Splitter.Panel>
                    <div className="h-full overflow-y-auto p-6">
                        {/* Khung viết bài */}
                        {user && currentId && (
                            <WritingEditor
                                assignmentId={assignment.id}
                                ownerId={currentId}
                                me={{ id: user.id, name: user.fullName }}
                                onPeopleChange={setPeople}
                            />
                        )}
                    </div>
                </Splitter.Panel>
            </Splitter>
        </div>
    );
}