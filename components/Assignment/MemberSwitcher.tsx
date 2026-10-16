"use client";

import { CourseMember } from "@/types/course-types";
import { Dropdown } from "antd";
import { useTranslations } from "next-intl";
import Button from "../Button";
import ArrowDownIcon from "../Icons/ArrowDownIcon";
import ArrowLeftIcon from "../Icons/ArrowLeftIcon";
import ArrowRightIcon from "../Icons/ArrowRightIcon";

type MemberSwitcherProps = {
    members: CourseMember[];
    value: string | null;
    currentUserId: string | null;
    onlineIds: Set<string>;
    onChange: (userId: string) => void;
}

// Cùng style với Button secondary dạng iconOnly; ant-dropdown-open là class antd gắn lên trigger khi menu đang mở
const TRIGGER_CLASS = [
    "inline-flex h-8 min-w-48 max-w-64 items-center justify-between gap-2 rounded-lg px-3 text-sm transition-colors cursor-pointer",
    "border border-border bg-bg text-fg",
    "hover:border-accent hover:bg-accent-bg hover:text-accent",
    "disabled:cursor-not-allowed disabled:opacity-50",
].join(" ");

function StatusDot({ online }: { online: boolean }) {
    return <span className={`size-2 shrink-0 rounded-full ${online ? "bg-[#52c41a]" : "bg-border"}`} />;
}

export default function MemberSwitcher({ members, value, currentUserId, onlineIds, onChange }: MemberSwitcherProps) {
    const t = useTranslations("WritingWorkspace.MemberSwitcher");

    const currentIndex = members.findIndex((m) => m.userId === value);
    const currentMember = currentIndex === -1 ? null : members[currentIndex];

    const getLabel = (member: CourseMember) => {
        let label = member.fullName;
        if (member.role === "TEACHER") label += ` (${t("teacher")})`;
        if (member.userId === currentUserId) label += ` (${t("you")})`;
        return label;
    };

    // Đi vòng: cuối danh sách bấm tiếp thì quay về đầu
    const goTo = (offset: number) => {
        if (members.length === 0) return;
        const base = currentIndex === -1 ? 0 : currentIndex;
        const next = (base + offset + members.length) % members.length;
        onChange(members[next].userId);
    };

    const items = members.map((m) => ({
        key: m.userId,
        label: (
            <span className="flex items-center gap-2">
                <StatusDot online={onlineIds.has(m.userId)} />
                <span className="truncate">{getLabel(m)}</span>
            </span>
        ),
    }));

    return (
        <div className="flex items-center gap-3">
            <Dropdown
                trigger={["click"]}
                placement="bottomRight"
                disabled={members.length === 0}
                menu={{
                    items,
                    selectable: true,
                    selectedKeys: value ? [value] : [],
                    onClick: ({ key }) => onChange(key),
                    style: { maxHeight: 320, overflowY: "auto" },
                }}
            >
                <button type="button" className={TRIGGER_CLASS}>
                    <span className="flex min-w-0 items-center gap-2">
                        {currentMember && <StatusDot online={onlineIds.has(currentMember.userId)} />}
                        <span className="truncate">{currentMember ? getLabel(currentMember) : t("placeholder")}</span>
                    </span>
                    <ArrowDownIcon width={16} height={16} />
                </button>
            </Dropdown>

            <Button
                label=""
                type="button"
                variant="secondary"
                icon={<ArrowLeftIcon width={16} height={16} />}
                iconOnly={true}
                onClick={() => goTo(-1)}
            />

            <Button
                label=""
                type="button"
                variant="secondary"
                icon={<ArrowRightIcon width={16} height={16} />}
                iconOnly={true}
                onClick={() => goTo(1)}
            />
        </div>
    );
}