"use client";

import { useTranslations } from "next-intl";
import Modal from "./Modal";
import { Course, UpdateCourseRequest } from "@/types/course-type";
import { useMemo, useState } from "react";
import TextInput from "../FormInput/TextInput";
import DateInput from "../FormInput/DateInput";
import Button from "../Button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { coursesApi } from "@/lib/api/courses-client";

type UpdateCourseModalProps = {
    course: Course;
    isOpen: boolean;
    onClose: () => void;
}

type Errors = {
    name?: string;
    session?: string;
    minStudents?: string;
    maxStudents?: string;
    startDate?: string;
    submit?:string;
}

export default function UpdateCourseModal({ course, isOpen, onClose } : UpdateCourseModalProps) {
    const t = useTranslations("UpdateCourseModal");
    const queryClient = useQueryClient();

    const [name, setName] = useState<string>(course.name);
    const [session, setSession] = useState<number | "">(course.totalSessions);
    const [minStudents, setMinStudents] = useState<number | "">(course.minStudents);
    const [maxStudents, setMaxStudents] = useState<number | "">(course.maxStudents);
    const [startDate, setStartDate] = useState<string>(course.startDate);

    const [errors, setErrors] = useState<Errors>({});

    const isDirty = useMemo(() => {
        return (
            name !== course.name ||
            session !== course.totalSessions ||
            minStudents !== course.minStudents ||
            maxStudents !== course.maxStudents ||
            startDate !== course.startDate
        );
    }, [name, session, minStudents, maxStudents, startDate, course]);

    const handleClose = () => {
        setErrors({});
        onClose();
    }

    const { mutate, isPending } = useMutation({
        mutationFn: (data: UpdateCourseRequest) => coursesApi.update(course.id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["courses"] });
            queryClient.invalidateQueries({ queryKey: ["course", course.id] });
            handleClose();
        },
        onError: (error) => {
            setErrors({ submit: error?.message });
        }
    });

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!isDirty) return;

        const newErrors: Errors = {};

        if (!name.trim()) newErrors.name = t("errors.nameRequired");
        if (session === "" || session <= 0) newErrors.session = t("errors.sessionRequired");
        if (minStudents === "" || minStudents < 0) newErrors.minStudents = t("errors.minStudentsRequired");
        if (maxStudents === "" || maxStudents <= 0) newErrors.maxStudents = t("errors.maxStudentsRequired");
        if (!startDate) newErrors.startDate = t("errors.startDateRequired");

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) return;

        const payload: UpdateCourseRequest = {};

        if (name !== course.name) payload.name = name;
        if (session !== course.totalSessions) payload.totalSessions = session as number;
        if (minStudents !== course.minStudents) payload.minStudents = minStudents as number;
        if (maxStudents !== course.maxStudents) payload.maxStudents = maxStudents as number;
        if (startDate !== course.startDate) payload.startDate = startDate;
        
        mutate(payload);
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title={t("title")}
            subtitle={t("subtitle")}
        >
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <TextInput
                    label={t("nameLabel")}
                    placeholder={t("namePlaceholder")}
                    value={name}
                    onChange={setName}
                    error={errors.name}
                />

                <TextInput
                    label={t("sessionLabel")}
                    placeholder={t("sessionPlaceholder")}
                    type="number"
                    value={session}
                    onChange={setSession}
                    error={errors.session}
                />

                <div className="flex flex-col gap-1.5">
                    <p className="text-sm font-medium text-fg">{t("rangeLabel")}</p>
                    <div className="flex items-center gap-2.5">
                        <TextInput
                            placeholder={t("minPlaceholder")}
                            type="number"
                            value={minStudents}
                            onChange={setMinStudents}
                            error={errors.minStudents}
                        />

                        <p className="text-muted">-</p>

                        <TextInput
                            placeholder={t("maxPlaceholder")}
                            type="number"
                            value={maxStudents}
                            onChange={setMaxStudents}
                            error={errors.maxStudents}
                        />

                        <p className="text-muted text-sm whitespace-nowrap">{t("rangeSuffix")}</p>
                    </div>
                </div>

                <DateInput
                    label={t("dateLabel")}
                    value={startDate}
                    onChange={setStartDate}
                    error={errors.startDate}
                />

                {errors.submit && (
                    <p className="text-sm text-error">{errors.submit}</p>
                )}

                <div className="flex justify-end">
                    <Button
                        label={t("save")}
                        type="submit"
                        loading={isPending}
                        disabled={!isDirty}
                    />
                </div>
            </form>
        </Modal>
    )
}