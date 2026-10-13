import { CourseMember } from "@/types/course-types";
import Button from "../Button";
import ArrowLeftIcon from "../Icons/ArrowLeftIcon";
import ArrowRightIcon from "../Icons/ArrowRightIcon";
import { useTranslations } from "next-intl";
import { Dropdown } from "antd";

type MemberSwitcherProps = {
    members: CourseMember[];
    value: string | null;
    currentUserId: string | null;
    onChange: (userId: string) => void;
}

export default function MemberSwitcher({ members, value, currentUserId, onChange }: MemberSwitcherProps) {
    const t = useTranslations("MemberSwitcher");

    const currentIndex = members.findIndex((m) => m.userId === value);
    const currentMember = currentIndex === -1 ? null : members[currentIndex];

    const getLabel = (member: CourseMember) => {
        let label = member.fullName;
        if (member.role === "TEACHER") label += ` (${t("teacher")})`;
        if (member.userId === currentUserId) label += ` (${t("you")})`;
        return label;
    };

    const goTo = (offset: number) => {
        if (members.length === 0) return;
        const base = currentIndex === -1 ? 0 : currentIndex;
        const next = (base + offset + members.length) % members.length;
        onChange(members[next].userId);
    };

    const items = members.map((m) => ({
        key: m.userId,
        label: getLabel(m),
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
                <button
                    type="button"
                    className="flex h-8 min-w-48 max-w-64 items-center justify-between gap-2 rounded-md border border-border bg-bg px-3 text-sm text-fg transition-colors hover:border-accent hover:bg-accent-bg hover:text-accent disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <span className="truncate">{currentMember ? getLabel(currentMember) : t("placeholder")}</span>
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
    )
}