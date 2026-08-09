"use client";

import { useTranslations } from "next-intl";
import Modal from "./Modal";
import TextInput from "../FormInput/TextInput";
import { useState } from "react";
import DateInput from "../FormInput/DateInput";
import Button from "../Button";

type CreateCourseModalProps = {
    isOpen: boolean;
    onClose: () => void;
}

export default function CreateCourseModal({ isOpen, onClose }: CreateCourseModalProps) {
    const t = useTranslations("CreateCourseModal");

    const [name, setName] = useState<string>("");
    const [session, setSession] = useState<number | "">("");
    const [minStudents, setMinStudents] = useState<number | "">("");
    const [maxStudents, setMaxStudents] = useState<number | "">("");
    const [startDate, setStartDate] = useState<string>("");

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={t("title")}
            subtitle={t("subtitle")}
        >
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <TextInput
                    label={t("nameLabel")}
                    placeholder={t("namePlaceholder")}
                    value={name}
                    onChange={setName}
                />

                <TextInput
                    label={t("sessionLabel")}
                    placeholder={t("sessionPlaceholder")}
                    type="number"
                    value={session}
                    onChange={setSession}
                />

                <div className="flex flex-col gap-1.5">
                    <p className="text-sm font-medium text-fg">{t("rangeLabel")}</p>
                    <div className="flex items-center gap-2.5">
                        <TextInput
                            placeholder={t("minPlaceholder")}
                            type="number"
                            value={minStudents}
                            onChange={setMinStudents}
                        />

                        <p className="text-muted">-</p>

                        <TextInput
                            placeholder={t("maxPlaceholder")}
                            type="number"
                            value={maxStudents}
                            onChange={setMaxStudents}
                        />

                        <p className="text-muted text-sm whitespace-nowrap">{t("rangeSuffix")}</p>
                    </div>
                </div>

                <DateInput
                    label={t("dateLabel")}
                    value={startDate}
                    onChange={setStartDate}
                />

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