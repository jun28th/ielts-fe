import { WeekSection } from "@/types/week-section-types"
import { useLocale, useTranslations } from "next-intl";
import Button from "../Button";
import PencilIcon from "../Icons/PencilIcon";
import { Popconfirm } from "antd";
import TrashIcon from "../Icons/TrashIcon";
import { formatDayMonth, formatTime, parseLocalDate, todayIso } from "@/lib/utils";
import PlusIcon from "../Icons/PlusIcon";
import UpdateWeekSectionModal from "../Modal/UpdateWeekSectionModal";
import { useState } from "react";

type WeekSectionCardProps = {
    courseId: string;
    weekSection: WeekSection;
}

export default function WeekSectionCard({ courseId, weekSection } : WeekSectionCardProps) {
    const t = useTranslations("TeacherCourseDetailPage.WeekSectionCard");
    const locale = useLocale();

    const weekdayFormatter = new Intl.DateTimeFormat(locale, { weekday: "short" });
    const today = todayIso();

    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);

    return (
        <div className="flex flex-col gap-3 rounded-xl bg-bg border border-border p-4">
            <div className="flex items-center justify-between">
                <div className="flex items-baseline gap-2">
                    <p className="text-lg font-bold text-fg">{weekSection.weekName}</p>
                    <p className="text-sm text-muted">
                        {t("sessionCount", { count: weekSection.sessions.length })}
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        label=""
                        type="button"
                        variant="secondary"
                        icon={<PencilIcon width={18} height={18} />}
                        iconOnly={true}
                        onClick={() => setIsUpdateModalOpen(true)}
                    />

                    <Popconfirm
                        title={t("deletePopconfirm.title")}
                        description={t("deletePopconfirm.subtitle")}
                        placement="bottomRight"
                        okText={t("deletePopconfirm.okText")}
                        cancelText={t("deletePopconfirm.cancelText")}
                        onConfirm={() => {}}
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

            <div className="grid grid-cols-2 gap-2 border-b border-border pb-4 sm:grid-cols-4 lg:grid-cols-7">
                {weekSection.sessions.map((session) => {
                    const isToday = session.date === today;
                    const isPast = session.date < today;

                    return (
                        <div
                            key={session.id}
                            className={[
                                "flex flex-col gap-0.5 rounded-lg border px-3 py-2 transition-colors",
                                isToday ? "border-accent bg-accent/5" : "border-border",
                                isPast ? "opacity-50" : "",
                            ].join(" ")}
                        >
                            <div className="flex items-baseline gap-1.5">
                                <p className={`text-xs font-medium uppercase ${isToday ? "text-accent" : "text-muted"}`}>
                                    {weekdayFormatter.format(parseLocalDate(session.date))}
                                </p>
                                <p className="text-sm font-semibold text-fg">
                                    {formatDayMonth(session.date)}
                                </p>
                            </div>

                            <p className="text-sm tabular-nums text-muted">
                                {formatTime(session.startTime)}–{formatTime(session.endTime)}
                            </p>
                        </div>
                    );
                })}
            </div>

            <div className="flex flex-col gap-3 pt-1">
                <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold uppercase tracking-wide text-muted">
                        {t("assignments.title")}
                    </p>

                    <Button
                        type="button"
                        variant="tertiary"
                        label={t("assignments.addButton")}
                        icon={<PlusIcon className="text-accent" width={18} height={18} />}
                        onClick={() => {}}
                    />
                </div>

                <p className="rounded-lg border border-dashed border-border py-6 text-center text-sm text-muted">
                    {t("assignments.empty")}
                </p>
            </div>

            <UpdateWeekSectionModal
                isOpen={isUpdateModalOpen}
                onClose={() => setIsUpdateModalOpen(false)}
                courseId={courseId}
                weekSection={weekSection}
            />
        </div>
    );
}