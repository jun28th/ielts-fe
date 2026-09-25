import { ClassSession, SessionErrors, UpdateWeekSectionRequest, WeekSection } from "@/types/week-section-types";
import Modal from "./Modal";
import { useTranslations } from "next-intl";
import { useAppMessage } from "@/contexts/message-context";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import TextInput from "../FormInput/TextInput";
import { formatTime } from "@/lib/utils";
import WeekCard from "../Course/WeekCard";
import Button from "../Button";
import { coursesApi } from "@/lib/api/courses-client";

const MIN_SESSIONS = 1;
const MAX_SESSIONS = 7;

const emptySession = (): ClassSession => ({
    id: crypto.randomUUID(),
    date: "",
    startTime: "",
    endTime: "",
    isNew: true
});

const toFormSessions = (sessions: ClassSession[]): ClassSession[] =>
    sessions.map((s) => ({
        ...s,
        startTime: formatTime(s.startTime),
        endTime: formatTime(s.endTime),
        isNew: false
    }));

const isSameSession = (a: ClassSession, b: ClassSession) =>
    a.id === b.id &&
    a.date === b.date &&
    a.startTime === b.startTime &&
    a.endTime === b.endTime;
    
type UpdateWeekSectionModalProps = {
    courseId: string;
    weekSection: WeekSection;
    isOpen: boolean;
    onClose: () => void;
}

type Errors = {
    weekName?: string;
    sessions?: Record<string, SessionErrors>;
}

export default function UpdateWeekSectionModal({ courseId, weekSection, isOpen, onClose } : UpdateWeekSectionModalProps) {
    const t = useTranslations("TeacherCourseDetailPage.UpdateWeekSectionModal");
    const message = useAppMessage();
    const queryClient = useQueryClient();

    const [weekName, setWeekName] = useState<string>(weekSection.weekName);
    const [sessionCount, setSessionCount] = useState<number | "">(weekSection.sessions.length);
    const [sessions, setSessions] = useState<ClassSession[]>(() => toFormSessions(weekSection.sessions));

    const [errors, setErrors] = useState<Errors>({});

    const isDirty = useMemo(() => {
        if (weekName.trim() !== weekSection.weekName) return true;

        const original = toFormSessions(weekSection.sessions);

        if (sessions.length !== original.length) return true;
        if (sessions.some(s => s.isNew)) return true;

        return sessions.some((s, i) => !isSameSession(s, original[i]));
    }, [weekName, sessions, weekSection]);

    const handleSessionCountChange = (value: number | "") => {
        if (value === "") {
            setSessionCount("");
            return;
        }

        const count = Math.min(Math.max(Math.floor(value), MIN_SESSIONS), MAX_SESSIONS);
        setSessionCount(count);

        setSessions(prev => {
            if (count > prev.length) {
                return [...prev, ...Array.from({ length: count - prev.length }, emptySession)];
            }
            return prev.slice(0, count);
        });
    }

    const handleDeleteSession = (id: string) => {
        if (sessions.length <= MIN_SESSIONS) return;

        const next = sessions.filter(s => s.id !== id);
        setSessions(next);
        setSessionCount(next.length);
    }

    const handleSessionChange = (id: string, value: ClassSession) => {
        setSessions(prev => prev.map(s => (s.id === id ? value : s)));
    }

    const handleClose = () => {
        setWeekName(weekSection.weekName);
        setSessionCount(weekSection.sessions.length);
        setSessions(toFormSessions(weekSection.sessions));
        setErrors({});
        onClose();
    }

    const { mutate, isPending } = useMutation({
        mutationFn: (data: UpdateWeekSectionRequest) => coursesApi.updateWeekSection(courseId, weekSection.id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["course", courseId] });
            message.success(t("updateSuccess"));
            setErrors({});
            onClose();
        },
        onError: (error) => {
            message.error(error.message);
        }
    });

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!isDirty) return;

        const newErrors: Errors = {};

        if (!weekName.trim()) {
            newErrors.weekName = t("errors.weekNameRequired");
        }

        const sessionErrors: Record<string, SessionErrors> = {};

        for (const session of sessions) {
            const err: SessionErrors = {};

            if (!session.date) err.date = t("errors.dateRequired");
            if (!session.startTime) err.startTime = t("errors.startTimeRequired");
            if (!session.endTime) err.endTime = t("errors.endTimeRequired");

            if (Object.keys(err).length > 0) {
                sessionErrors[session.id] = err;
            }
        }

        if (Object.keys(sessionErrors).length > 0) {
            newErrors.sessions = sessionErrors;
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            return;
        }

        mutate({
            weekName: weekName.trim(),
            sessions: sessions.map(({ id, isNew, date, startTime, endTime }) => ({
                id: isNew ? null : id,
                date,
                startTime,
                endTime,
            })),
        });
    }

    return (
        <Modal
            title={t("title")}
            subtitle={t("subtitle")}
            isOpen={isOpen}
            onClose={handleClose}
            size="2xl"
        >
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2 min-w-0">
                        <TextInput
                            label={t("weekNameLabel")}
                            value={weekName}
                            onChange={setWeekName}
                            error={errors.weekName}
                        />
                    </div>

                    <div className="col-span-1 min-w-0">
                        <TextInput
                            type="number"
                            label={t("sessionCountLabel")}
                            value={sessionCount}
                            onChange={handleSessionCountChange}
                        />
                    </div>
                </div>

                <p className="text-sm font-medium text-fg">{t("sessionTimes")}</p>

                <div className="flex flex-col gap-2">
                    {sessions.map((session, i) => (
                        <WeekCard
                            key={session.id}
                            index={i}
                            value={session}
                            onChange={(value) => handleSessionChange(session.id, value)}
                            onDelete={() => handleDeleteSession(session.id)}
                            canDelete={sessions.length > MIN_SESSIONS}
                            errors={errors.sessions?.[session.id]}
                        />
                    ))}
                </div>

                <div className="flex justify-end">
                    <Button
                        label={t("submit")}
                        type="submit"
                        loading={isPending}
                        disabled={!isDirty}
                    />
                </div>
            </form>
        </Modal>
    )
}