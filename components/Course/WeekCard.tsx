import { useTranslations } from "next-intl";
import DateInput from "../FormInput/DateInput";
import { SessionTime } from "@/types/week-section-types";
import TimeInput from "../FormInput/TimeInput";
import TrashIcon from "../Icons/TrashIcon";
import Button from "../Button";

type WeekCardProps = {
    index: number;
    value: SessionTime;
    onChange: (value: SessionTime) => void;
    onDelete: () => void;
    canDelete: boolean
}

export default function WeekCard({ index, value, onChange, onDelete, canDelete }: WeekCardProps) {
    const t = useTranslations("TeacherCourseDetailPage.CreateWeekSectionModal.weekCard");

    return (
        <div className="flex flex-col gap-2 rounded-xl border border-border p-3">
            <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted">{t("sessionLabel", { number: index + 1 })}</p>

                <Button
                    label=""
                    iconOnly={true}
                    variant="danger"
                    icon={<TrashIcon width={18} height={18} className=""/>}
                    onClick={onDelete}
                    disabled={!canDelete}
                />
            </div>

            <div className="grid grid-cols-3 gap-2">
                <div className="min-w-0">
                    <DateInput
                        label={t("dateLabel")}
                        value={value.date}
                        onChange={(date) => onChange({ ...value, date })}
                    />
                </div>

                <div className="min-w-0">
                    <TimeInput
                        label={t("startTimeLabel")}
                        value={value.startTime}
                        onChange={(startTime) => onChange({ ...value, startTime })}
                    />
                </div>

                <div className="min-w-0">
                    <TimeInput
                        label={t("endTimeLabel")}
                        value={value.endTime}
                        onChange={(endTime) => onChange({ ...value, endTime })}
                    />
                </div>
            </div>
        </div>
    );
}