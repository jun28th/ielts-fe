"use client";

import { Criterion, CriterionFilter } from "@/types/writing-assignment-types";
import { useTranslations } from "next-intl";
import { useState } from "react";

const CRITERIA: Criterion[] = ["TR", "CC", "LR", "GRA"];
const FILTERS: CriterionFilter[] = ["ALL", ...CRITERIA];

export default function CorrectionPanel() {
    const t = useTranslations("CorrectionPanel");

    const [filter, setFilter] = useState<CriterionFilter>("ALL");

    return (
        <div className="flex flex-col gap-3">
            <p className="font-semibold text-fg">{t("title")}</p>

            <div className="flex flex-wrap gap-1.5">
                {FILTERS.map((item) => {
                    const active = item === filter;

                    return (
                        <button
                            key={item}
                            type="button"
                            onClick={() => setFilter(item)}
                            className={
                                active
                                    ? "rounded-full border border-fg bg-fg px-4 py-1 text-sm text-bg"
                                    : "rounded-full border border-border bg-bg px-4 py-1 text-sm text-fg hover:border-fg/40"
                            }
                        >
                            {item === "ALL" ? t("all") : item}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}