"use client";

import { useTranslations } from "next-intl";
import Button from "../Button";
import { Popover } from "antd";
import { useState } from "react";
import PencilAiIcon from "../Icons/PencilAiIcon";
import QuillPenAiIcon from "../Icons/QuillPenAiIcon";

const BANDS = [5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9];
const DEFAULT_BAND = 6;

const BAND_BUTTON_BASE_CLASS = "rounded-md py-1.5 text-sm tabular-nums transition-colors";
const BAND_BUTTON_ACTIVE_CLASS = "bg-accent text-bg";
const BAND_BUTTON_INACTIVE_CLASS = "bg-bg text-fg inset-ring inset-ring-border hover:inset-ring-accent hover:text-accent";

type AiAssistMenuProps = {
    canImprove: boolean;
};

export default function AiAssistMenu({ canImprove }: AiAssistMenuProps) {
    const t = useTranslations("WritingWorkspace.AiAssistMenu");

    const [isImproveOpen, setIsImproveOpen] = useState<boolean>(false);
    const [targetBand, setTargetBand] = useState<number>(DEFAULT_BAND);

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

            <div className="flex justify-end">
                <Button label={t("start")} type="button" size="sm" onClick={() => {}} />
            </div>
        </div>
    );

    return (
        <div className="flex items-center gap-2">
            <Button
                label={t("fix")}
                type="button"
                variant="tertiary"
                size="sm"
                icon={<PencilAiIcon width={16} height={16} />}
                onClick={() => {}}
            />

            {canImprove && (
                <Popover
                    content={improveContent}
                    trigger="click"
                    placement="bottomRight"
                    open={isImproveOpen}
                    onOpenChange={setIsImproveOpen}
                >
                    <span className="inline-flex">
                        <Button
                            label={t("improve")}
                            type="button"
                            variant="tertiary"
                            size="sm"
                            icon={<QuillPenAiIcon width={16} height={16} />}
                        />
                    </span>
                </Popover>
            )}
        </div>
    );
}