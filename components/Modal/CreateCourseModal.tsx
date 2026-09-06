"use client";

import { useTranslations } from "next-intl";
import Modal from "./Modal";
import TextInput from "../FormInput/TextInput";
import { useState } from "react";
import DateInput from "../FormInput/DateInput";
import Button from "../Button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { coursesApi } from "@/lib/api/courses-client";
import { CreateCourseRequest } from "@/types/course-type";

type CreateCourseModalProps = {
    isOpen: boolean;
    onClose: () => void;
}

type Errors = {
    name?: string;
    session?: string;
    minStudents?: string;
    maxStudents?: string;
    startDate?: string;
}

export default function CreateCourseModal({ isOpen, onClose }: CreateCourseModalProps) {
    const t = useTranslations("CreateCourseModal");

    const [name, setName] = useState<string>("");
    const [session, setSession] = useState<number | "">("");
    const [minStudents, setMinStudents] = useState<number | "">("");
    const [maxStudents, setMaxStudents] = useState<number | "">("");
    const [startDate, setStartDate] = useState<string>("");
    
    const [errors, setErrors] = useState<Errors>({});

    const queryClient = useQueryClient();

    const handleClose = () => {
        setName("");
        setSession("");
        setMinStudents("");
        setMaxStudents("");
        setStartDate("");
        setErrors({});
        onClose();
    }

    const { mutate, isPending } = useMutation({
        mutationFn: (data: CreateCourseRequest) => coursesApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["courses"] });
            handleClose();
        }
    });

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();

        const newErrors: Errors = {};

        if (!name.trim()) newErrors.name = t("errors.nameRequired");
        if (session === "" || session <= 0) newErrors.session = t("errors.sessionRequired");
        if (minStudents === "" || minStudents < 0) newErrors.minStudents = t("errors.minStudentsRequired");
        if (maxStudents === "" || maxStudents <= 0) newErrors.maxStudents = t("errors.maxStudentsRequired");
        if (!startDate) newErrors.startDate = t("errors.startDateRequired");

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        mutate({
            name: name.trim(),
            startDate,
            totalSessions: Number(session),
            minStudents: Number(minStudents),
            maxStudents: Number(maxStudents)
        });
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

                <div className="flex justify-end">
                    <Button
                        label={t("submit")}
                        type="submit"
                        loading={isPending}
                    />
                </div>
            </form>
        </Modal>
    )
}