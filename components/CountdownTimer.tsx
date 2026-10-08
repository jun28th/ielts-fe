import { useState } from "react";
import ClockIcon from "./Icons/ClockIcon";
import { Statistic } from "antd";
import { useTranslations } from "next-intl";

type CountdownTimerProps = {
    storageKey: string;
    durationMinutes: number;
    onExpire?: () => void;
}

const PREFIX = "writing-deadline:";

function getOrCreateDeadline(storageKey: string, durationMinutes: number) {
    const key = PREFIX + storageKey;

    try {
        const saved = Number(localStorage.getItem(key));
        if (saved > 0) return saved;
    } catch {

    }
 
    const deadline = Date.now() + durationMinutes * 60000;
    try {
        localStorage.setItem(key, String(deadline));
    } catch {

    }
    return deadline;
}

export function clearCountdown(storageKey: string) {
    try {
        localStorage.removeItem(PREFIX + storageKey);
    } catch {

    }
}

export default function CountdownTimer({ storageKey, durationMinutes, onExpire }: CountdownTimerProps) {
    const t = useTranslations("CountdownTimer");
    const [deadline] = useState(() => getOrCreateDeadline(storageKey, durationMinutes));

    return (
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-sm">
            <ClockIcon width={18} height={18} className="text-accent" />
            <Statistic.Timer
                type="countdown"
                value={deadline}
                format="mm:ss"
                onFinish={onExpire}
            />
            <span className="text-muted">{t("remaining")}</span>
        </div>
    );
}