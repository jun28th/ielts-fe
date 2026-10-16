"use client";

import { useEditorState, type Editor } from "@tiptap/react";
import { CorrectionRange, Criterion, CRITERION_STYLES, CriterionFilter } from "@/types/writing-assignment-types";
import { List } from "antd";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { collectCorrections, CorrectionMark } from "./CorrectionMark";

const CRITERIA: Criterion[] = ["TR", "CC", "LR", "GRA"];
const FILTERS: CriterionFilter[] = ["ALL", ...CRITERIA];

const CHIP_BASE_CLASS = "inline-flex items-center gap-1.5 rounded-full py-1 pl-3 pr-1.5 text-sm font-medium transition-colors";
const CHIP_INACTIVE_CLASS = "bg-bg text-fg inset-ring inset-ring-border";
const CHIP_ALL_ACTIVE_CLASS = "bg-accent text-bg";
const CHIP_ALL_HOVER_CLASS = "hover:inset-ring-fg/40";
const COUNT_CLASS = "min-w-5 rounded-full bg-current/15 px-1.5 py-px text-center tabular-nums";

const CARD_CLASS = "flex w-full flex-col gap-2 rounded-xl border border-border bg-bg p-3";
const NUMBER_BADGE_CLASS = "flex size-5 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold";
const CRITERION_TAG_CLASS = "rounded-md px-1.5 py-0.5 text-xs font-semibold";
const BADGE_FALLBACK_CLASS = "bg-fg text-bg";

const ORIGINAL_CLASS = "font-serif text-error line-through decoration-error";
const NEW_TEXT_CLASS = "rounded-md bg-success-bg px-1.5 py-0.5 font-serif text-success";
const QUOTE_CLASS = "font-serif italic text-fg";

type CorrectionItem = CorrectionRange & {
    index: number;
    original: string;
};

type CorrectionPanelProps = {
    editor: Editor | null;
    readOnly?: boolean;
};

export default function CorrectionPanel({ editor, readOnly = false }: CorrectionPanelProps) {
    const t = useTranslations("WritingWorkspace.CorrectionPanel");
    const tMenu = useTranslations("WritingWorkspace.CorrectionMenu");

    const [filter, setFilter] = useState<CriterionFilter>("ALL");

    const corrections: CorrectionItem[] =
        useEditorState({
            editor,
            selector: ({ editor }) => {
                if (!editor) return [];
                const { doc } = editor.state;

                return collectCorrections(doc, CorrectionMark.name).map((range, index) => ({
                    ...range,
                    index,
                    original: doc.textBetween(range.from, range.to, " "),
                }));
            },
        }) ?? [];

    const countOf = (item: CriterionFilter) =>
        item === "ALL" ? corrections.length : corrections.filter((c) => c.attrs.criterion === item).length;

    const visible = filter === "ALL" ? corrections : corrections.filter((c) => c.attrs.criterion === filter);

    const renderContent = ({ attrs, original }: CorrectionItem) => {
        switch (attrs.type) {
            case "replace":
                return (
                    <p className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
                        <span className={ORIGINAL_CLASS}>{original}</span>
                        <span className="text-muted">→</span>
                        <span className={NEW_TEXT_CLASS}>{attrs.text}</span>
                    </p>
                );
            case "delete":
                return (
                    <p>
                        <span className={ORIGINAL_CLASS}>{original}</span>
                    </p>
                );
            case "insert":
                return (
                    <p>
                        <span className={NEW_TEXT_CLASS}>+ {attrs.text}</span>
                    </p>
                );
            case "comment":
                return <p className={QUOTE_CLASS}>“{original}”</p>;
        }
    };

    return (
        <div className="flex min-h-0 flex-1 flex-col gap-3">
            <p className="font-semibold text-fg">{t("title")}</p>

            <div className="flex flex-wrap gap-1.5">
                {FILTERS.map((item) => {
                    const active = item === filter;
                    const style = item === "ALL" ? null : CRITERION_STYLES[item];

                    const stateClass = active
                        ? style?.active ?? CHIP_ALL_ACTIVE_CLASS
                        : `${CHIP_INACTIVE_CLASS} ${style?.hover ?? CHIP_ALL_HOVER_CLASS}`;

                    return (
                        <button
                            key={item}
                            type="button"
                            onClick={() => setFilter(item)}
                            className={`${CHIP_BASE_CLASS} ${stateClass}`}
                        >
                            {style && <span className={`size-2 rounded-full ${style.badge}`} />}
                            <span>{item === "ALL" ? t("all") : item}</span>
                            <span className={COUNT_CLASS}>{countOf(item)}</span>
                        </button>
                    );
                })}
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto pr-1">
                <List<CorrectionItem>
                    dataSource={visible}
                    rowKey={(item) => item.attrs.id}
                    split={false}
                    locale={{ emptyText: t("empty") }}
                    renderItem={(item) => {
                        const style = CRITERION_STYLES[item.attrs.criterion];

                        return (
                            <List.Item style={{ padding: 0, marginBottom: 8 }}>
                                <div className={CARD_CLASS}>
                                    <div className="flex items-center gap-2">
                                        <span className={`${NUMBER_BADGE_CLASS} ${style?.badge ?? BADGE_FALLBACK_CLASS}`}>
                                            {item.index + 1}
                                        </span>
                                        <span className={`${CRITERION_TAG_CLASS} ${style?.active ?? ""}`}>
                                            {item.attrs.criterion}
                                        </span>
                                        <span className="text-sm text-muted">{tMenu(`types.${item.attrs.type}`)}</span>
                                    </div>

                                    <div className="text-sm">{renderContent(item)}</div>

                                    {item.attrs.description && (
                                        <p className="text-sm text-fg/80">{item.attrs.description}</p>
                                    )}
                                </div>
                            </List.Item>
                        );
                    }}
                />
            </div>
        </div>
    );
}