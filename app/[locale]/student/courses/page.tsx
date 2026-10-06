"use client";

import { CourseStatus } from "@/types/course-types";
import { useTranslations } from "next-intl";
import { useState } from "react";

type Filter = "ALL" | CourseStatus;

const FILTERS: Filter[] = ["ALL", "UPCOMING", "ACTIVE", "ENDED"];
const PAGE_SIZE = 9;

export default function StudentCoursesPage() {
    const t = useTranslations("StudentCoursesPage");

    const [filter, setFilter] = useState<Filter>("ALL");
    const [page, setPage] = useState<number>(0);

    const handleFilterChange = (key: Filter) => {
        setFilter(key);
        setPage(0);
    };

    return (
        <>
            <div>
                <h1 className="font-serif font-bold text-2xl mb-1">
                    {t("title")}
                </h1>
                <p className="text-muted text-sm">
                    {t("subtitle")}
                </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
                {FILTERS.map((key) => {
                    const isActive = key === filter;

                    return (
                        <button
                            key={key}
                            type="button"
                            onClick={() => handleFilterChange(key)}
                            className={`inline-flex h-9 items-center gap-1.5 rounded-full border px-3.5 text-sm font-semibold transition-colors ${
                                isActive
                                    ? "border-accent bg-accent text-white"
                                    : "border-border bg-bg text-muted hover:border-muted hover:text-fg"
                            }`}
                        >
                            {t(`filters.${key}`)}
                        </button>
                    )
                })}
            </div>
        </>
    )
}