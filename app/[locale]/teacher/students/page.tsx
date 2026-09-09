"use client";

import Button from "@/components/Button";
import PlusIcon from "@/components/Icons/PlusIcon";
import CreateStudentModal from "@/components/Modal/CreateStudentModal";
import { useTranslations } from "next-intl";
import { useState } from "react";

export default function StudentsPage() {
    const t = useTranslations("TeacherStudentsPage");

    const [isOpen, setIsOpen] = useState<boolean>(false);

    return (
        <>
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-serif font-bold text-2xl mb-1">
                        {t("title")}
                    </h1>
                    <p className="text-muted text-sm">
                        {t("subtitle")}
                    </p>
                </div>

                <Button
                    variant="primary"
                    label={t("createButton")}
                    icon={<PlusIcon className="text-white" width={20} height={20}/>}
                    onClick={() => setIsOpen(true)}
                />
            </div>


            <CreateStudentModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </>
    )
}