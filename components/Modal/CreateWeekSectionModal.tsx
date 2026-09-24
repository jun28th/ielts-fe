import { useTranslations } from "next-intl";
import Modal from "./Modal";
import { useState } from "react";
import TextInput from "../FormInput/TextInput";
import WeekCard from "../Course/WeekCard";
import { SessionTime } from "@/types/week-section-types";
import Button from "../Button";
import { Course } from "@/types/course-types";

const MIN_SESSIONS = 1;
const MAX_SESSIONS = 7;

const emptySession = (): SessionTime => ({
    id: crypto.randomUUID(),
    date: "",
    startTime: "",
    endTime: "",
});

type CreateWeekSectionModalProps = {
    course: Course;
    isOpen: boolean;
    onClose: () => void;
    nextWeekNumber?: number;
}

export default function CreateWeekSectionModal({ isOpen, onClose, nextWeekNumber = 1 } : CreateWeekSectionModalProps) {
    const t = useTranslations("TeacherCourseDetailPage.CreateWeekSectionModal");

    const [weekName, setWeekName] = useState<string>(() => t("defaultWeekName", { number: nextWeekNumber }));
    const [sessionCount, setSessionCount] = useState<number | "">(MIN_SESSIONS);
    const [sessions, setSessions] = useState<SessionTime[]>(() => [emptySession()]);

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

    const handleSessionChange = (id: string, value: SessionTime) => {
        setSessions(prev => prev.map(s => (s.id === id ? value : s)));
    }

    const handleClose = () => {
        setWeekName(t("defaultWeekName", { number: nextWeekNumber }));
        setSessionCount(MIN_SESSIONS);
        setSessions([emptySession()]);
        onClose();
    }

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();


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
                        />
                    ))}
                </div>

                <div className="flex justify-end">
                    <Button
                        label={t("submit")}
                        type="submit"
                    />
                </div>
            </form>
        </Modal>
    )
}