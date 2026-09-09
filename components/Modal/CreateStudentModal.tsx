"use client";

import { useTranslations } from "next-intl";
import Modal from "./Modal";
import { useAppMessage } from "@/contexts/message-context";
import TextInput from "../FormInput/TextInput";
import { useState } from "react";
import { Table, TableColumnsType } from "antd";
import { Course, CourseStatus } from "@/types/course-type";
import Button from "../Button";
import { useQuery } from "@tanstack/react-query";
import { coursesApi } from "@/lib/api/courses-client";

const STATUS_STYLE: Record<CourseStatus, string> = {
    UPCOMING: "text-accent-active",
    ACTIVE: "text-success",
    ENDED: "text-muted",
};

type CreateStudentModalProps = {
    isOpen: boolean;
    onClose: () => void;
}

type Errors = {
    fullName?: string;
    email?: string;
    phoneNumber?: string;
};

type CourseTableProps = {
    selectedIds: string[];
    onSelectionChange: (ids: string[]) => void;
};

function CourseTable({ selectedIds, onSelectionChange }: CourseTableProps) {
    const t = useTranslations("CreateStudentModal");

    const { data, isPending, isError } = useQuery({
        queryKey: ["courses", "enrollable"],
        queryFn: () => coursesApi.listEnrollable({ page: 0, size: 100 }),
    });

    const columns: TableColumnsType<Course> = [
        {
            title: t("columns.name"),
            dataIndex: "name",
            width: "70%",
        },
        {
            title: t("columns.status"),
            dataIndex: "status",
            width: "30%",
            render: (status: CourseStatus) => (
                <span className={`text-xs ${STATUS_STYLE[status]}`}>
                    {t(`status.${status}`)}
                </span>
            ),
        },
    ];

    if (isError) {
        return <p className="text-sm text-error">{t("courseLoadError")}</p>;
    }

    return (
        <Table<Course>
            rowKey="id"
            loading={isPending}
            rowSelection={{
                selectedRowKeys: selectedIds,
                onChange: (keys) => onSelectionChange(keys as string[]),
            }}
            columns={columns}
            dataSource={data?.content ?? []}
            pagination={false}
            scroll={{ y: 150 }}
            size="small"
            bordered={true}
        />
    );
}

export default function CreateStudentModal({ isOpen, onClose } : CreateStudentModalProps) {
    const t = useTranslations("CreateStudentModal");
    const message = useAppMessage();

    const [fullName, setFullName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [phoneNumber, setPhoneNumber] = useState<string>("");
    const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([]);

    const [errors, setErrors] = useState<Errors>({});

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        const newErrors: Errors = {};


    }

    return (
        <Modal
            title={t("title")}
            subtitle={t("subtitle")}
            isOpen={isOpen}
            onClose={onClose}
            size="xl"
        >
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <TextInput
                    label={t("fullNameLabel")}
                    placeholder={t("fullNamePlaceholder")}
                    value={fullName}
                    onChange={setFullName}
                    error={errors.fullName}
                />

                <TextInput
                    type={"email"}
                    label={t("emailLabel")}
                    placeholder={t("emailPlaceholder")}
                    value={email}
                    onChange={setEmail}
                    error={errors.email}
                />

                <TextInput
                    label={t("phoneLabel")}
                    placeholder={t("phonePlaceholder")}
                    value={phoneNumber}
                    onChange={setPhoneNumber}
                    error={errors.phoneNumber}
                />

                <div className="flex flex-col gap-1.5">
                    <p className="text-sm font-medium text-fg">
                        {t("courseLabel")}
                    </p>
                    <CourseTable
                        selectedIds={selectedCourseIds}
                        onSelectionChange={setSelectedCourseIds}
                    />
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