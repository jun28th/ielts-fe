"use client";

import Button from "@/components/Button";
import TextInput from "@/components/FormInput/TextInput";
import PencilIcon from "@/components/Icons/PencilIcon";
import PlusIcon from "@/components/Icons/PlusIcon";
import TrashIcon from "@/components/Icons/TrashIcon";
import CreateStudentModal from "@/components/Modal/CreateStudentModal";
import UpdateStudentModal from "@/components/Modal/UpdateStudentModal";
import { useDebounce } from "@/hooks/useDebounce";
import { userApi } from "@/lib/api/user-client";
import { formatInstant } from "@/lib/utils";
import { CourseStatus } from "@/types/course-types";
import { CourseSummary, Student } from "@/types/user-types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Popconfirm, Table, TableColumnsType } from "antd";
import { useTranslations } from "next-intl";
import { useState } from "react";

const STATUS_STYLE: Record<CourseStatus, string> = {
    UPCOMING: "bg-accent-bg text-accent-active",
    ACTIVE: "bg-success-bg text-success",
    ENDED: "bg-surface text-muted border border-border",
};

const DEFAULT_PAGE_SIZE = 10;

export default function StudentsPage() {
    const t = useTranslations("TeacherStudentsPage");

    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

    const [page, setPage] = useState<number>(0);
    const [search, setSearch] = useState<string>("");

    const debouncedSearch = useDebounce(search.trim(), 700);

    const { data, isLoading, isFetching, isError } = useQuery({
        queryKey: ["students", page, debouncedSearch],
        queryFn: () => userApi.getAllStudentAccounts({ 
            page, 
            size: DEFAULT_PAGE_SIZE, 
            search: debouncedSearch || undefined 
        }),
        placeholderData: keepPreviousData,
    });

    const handleSearchChange = (value: string) => {
        setSearch(value);
        setPage(0);
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage - 1);
    };

    const handleEditClick = (student: Student) => {
        setSelectedStudent(student);
        setIsUpdateModalOpen(true);
    };

    const handleUpdateModalClose = () => {
        setIsUpdateModalOpen(false);
        setSelectedStudent(null);
    };

    const columns: TableColumnsType<Student> = [
        {
            title: t("columns.fullName"),
            dataIndex: "fullName",
            key: "fullName",
            width: "15%",
            render: (fullName: string) => (
                <span>{fullName}</span>
            ),
        },
        {
            title: t("columns.email"),
            dataIndex: "email",
            key: "email",
            width: "20%"
        },
        {
            title: t("columns.phoneNumber"),
            dataIndex: "phoneNumber",
            key: "phoneNumber",
            width: "13%",
            render: (phoneNumber: string | null) => phoneNumber || <span className="text-muted">—</span>,
        },
        {
            title: t("columns.courses"),
            dataIndex: "courses",
            key: "courses",
            width: "27%",
            render: (courses: CourseSummary[]) => 
                courses.length === 0 ? (
                    <span>{t("noCourses")}</span>
                ) : (
                    <div className="flex flex-wrap gap-1">
                        {courses.map((course) => (
                            <p 
                                key={course.id}
                                className={`inline-flex h-7 flex-none items-center whitespace-nowrap rounded-full px-3 text-xs font-medium ${STATUS_STYLE[course.status]}`}
                            >
                                {course.name}
                            </p>
                        ))}
                    </div>
                )
        },
        {
            title: t("columns.createdAt"),
            dataIndex: "createdAt",
            key: "createdAt",
            width: "15%",
            render: (createdAt: string) => (
                <span>{formatInstant(createdAt)}</span>
            )
        },
        {
            title: t("columns.action"),
            key: "action",
            width: "10%",
            render: (_, record) => (
                <div className="flex items-center justify-center gap-2">
                    <Button
                        label=""
                        type="button"
                        variant="secondary"
                        icon={<PencilIcon width={16} height={16} />}
                        iconOnly={true}
                        onClick={() => handleEditClick(record)}
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
                            <TrashIcon width={16} height={16} />
                        </button>
                    </Popconfirm>
                </div>
            )
        }
    ];

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
                    onClick={() => setIsCreateModalOpen(true)}
                />
            </div>

            <div className="mt-6 mb-4 max-w-sm">
                <TextInput
                    value={search}
                    onChange={handleSearchChange}
                    placeholder={t("searchPlaceholder")}
                />
            </div>

            {isError ? (
                <p className="text-sm text-error">{t("loadError")}</p>
            ) : (
                <Table<Student>
                    rowKey="id"
                    columns={columns}
                    dataSource={data?.content ?? []}
                    bordered={true}
                    size="small"
                    loading={isLoading || isFetching}
                    pagination={{
                        current: page + 1,
                        pageSize: DEFAULT_PAGE_SIZE,
                        total: data?.totalElements ?? 0,
                        onChange: handlePageChange,
                    }}
                />
            )}

            <CreateStudentModal 
                isOpen={isCreateModalOpen} 
                onClose={() => setIsCreateModalOpen(false)} 
            />

            {selectedStudent && (
                <UpdateStudentModal
                    student={selectedStudent}
                    isOpen={isUpdateModalOpen}
                    onClose={handleUpdateModalClose}
                />
            )}
        </>
    )
}