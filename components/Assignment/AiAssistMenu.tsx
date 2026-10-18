"use client";

import { useLocale, useTranslations } from "next-intl";
import Button from "../Button";
import { Popover, Segmented } from "antd";
import { useState } from "react";
import PencilAiIcon from "../Icons/PencilAiIcon";
import QuillPenAiIcon from "../Icons/QuillPenAiIcon";
import { AiMode, ResponseLanguage } from "@/types/writing-assignment-types";

const BANDS = [5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9];
const DEFAULT_BAND = 6;

const LANGUAGE_OPTIONS: { value: ResponseLanguage; label: string }[] = [
    { value: "vi", label: "Tiếng Việt" },
    { value: "en", label: "English" },
];

const BAND_BUTTON_BASE_CLASS = "rounded-md py-1.5 text-sm tabular-nums transition-colors";
const BAND_BUTTON_ACTIVE_CLASS = "bg-accent text-bg";
const BAND_BUTTON_INACTIVE_CLASS = "bg-bg text-fg inset-ring inset-ring-border hover:inset-ring-accent hover:text-accent";

type AiAssistMenuProps = {
    canImprove: boolean;
    runningMode: AiMode | null;
    onFix: (language: ResponseLanguage) => void;
    onImprove: (targetBand: number, language: ResponseLanguage) => void;
};

export default function AiAssistMenu({ canImprove, runningMode, onFix, onImprove }: AiAssistMenuProps) {
    const t = useTranslations("WritingWorkspace.AiAssistMenu");
    const locale = useLocale();

    const [isFixOpen, setIsFixOpen] = useState<boolean>(false);
    const [isImproveOpen, setIsImproveOpen] = useState<boolean>(false);
    const [targetBand, setTargetBand] = useState<number>(DEFAULT_BAND);
    const [language, setLanguage] = useState<ResponseLanguage>(locale === "vi" ? "vi" : "en");

    const isRunning = runningMode !== null;

    // Đang chạy AI thì không cho mở popover
    const handleFixOpenChange = (open: boolean) => {
        setIsFixOpen(open && !isRunning);
    };

    const handleImproveOpenChange = (open: boolean) => {
        setIsImproveOpen(open && !isRunning);
    };

    const handleStartFix = () => {
        setIsFixOpen(false);
        onFix(language);
    };

    const handleStartImprove = () => {
        setIsImproveOpen(false);
        onImprove(targetBand, language);
    };

    const languageSection = (
        <div className="flex flex-col gap-1.5">
            <p className="text-xs font-medium text-fg">{t("language")}</p>
            <Segmented<ResponseLanguage>
                block
                size="small"
                value={language}
                onChange={setLanguage}
                options={LANGUAGE_OPTIONS}
            />
        </div>
    );

    const fixContent = (
        <div className="flex w-60 flex-col gap-3">
            {languageSection}

            <div className="flex justify-end">
                <Button label={t("start")} type="button" size="sm" onClick={handleStartFix} />
            </div>
        </div>
    );

    const improveContent = (
        <div className="flex w-60 flex-col gap-3">
            <div className="flex flex-col gap-1.5">
                <p className="text-xs font-medium text-fg">{t("targetBand")}</p>
                <div className="grid grid-cols-5 gap-1">
                    {BANDS.map((band) => (
                        <button
                            key={band}
                            type="button"
                            onClick={() => setTargetBand(band)}
                            className={`${BAND_BUTTON_BASE_CLASS} ${
                                band === targetBand ? BAND_BUTTON_ACTIVE_CLASS : BAND_BUTTON_INACTIVE_CLASS
                            }`}
                        >
                            {band.toFixed(1)}
                        </button>
                    ))}
                </div>
            </div>

            {languageSection}

            <div className="flex justify-end">
                <Button label={t("start")} type="button" size="sm" onClick={handleStartImprove} />
            </div>
        </div>
    );

    return (
        <div className="flex items-center gap-2">
            <Popover
                content={fixContent}
                trigger="click"
                placement="bottomRight"
                open={isFixOpen}
                onOpenChange={handleFixOpenChange}
            >
                <span className="inline-flex">
                    <Button
                        label={t("fix")}
                        type="button"
                        variant="tertiary"
                        size="sm"
                        icon={<PencilAiIcon width={16} height={16} />}
                        loading={runningMode === "FIX"}
                        disabled={isRunning}
                    />
                </span>
            </Popover>

            {canImprove && (
                <Popover
                    content={improveContent}
                    trigger="click"
                    placement="bottomRight"
                    open={isImproveOpen}
                    onOpenChange={handleImproveOpenChange}
                >
                    <span className="inline-flex">
                        <Button
                            label={t("improve")}
                            type="button"
                            variant="tertiary"
                            size="sm"
                            icon={<QuillPenAiIcon width={16} height={16} />}
                            loading={runningMode === "IMPROVE"}
                            disabled={isRunning}
                        />
                    </span>
                </Popover>
            )}
        </div>
    );
}