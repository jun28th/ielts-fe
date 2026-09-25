import { useTranslations } from "next-intl";
import DateInput from "../FormInput/DateInput";
import { SessionErrors, ClassSession } from "@/types/week-section-types";
import TimeInput from "../FormInput/TimeInput";
import TrashIcon from "../Icons/TrashIcon";
import Button from "../Button";

type WeekCardProps = {
    index: number;
    value: ClassSession;
    onChange: (value: ClassSession) => void;
    onDelete: () => void;
    canDelete: boolean;
    errors?: SessionErrors;
}

export default function WeekCard({ index, value, onChange, onDelete, canDelete, errors }: WeekCardProps) {
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
                        error={errors?.date}
                    />
                </div>

                <div className="min-w-0">
                    <TimeInput
                        label={t("startTimeLabel")}
                        value={value.startTime}
                        onChange={(startTime) => onChange({ ...value, startTime })}
                        error={errors?.startTime}
                    />
                </div>

                <div className="min-w-0">
                    <TimeInput
                        label={t("endTimeLabel")}
                        value={value.endTime}
                        onChange={(endTime) => onChange({ ...value, endTime })}
                        error={errors?.endTime}
                    />
                </div>
            </div>
        </div>
    );
}