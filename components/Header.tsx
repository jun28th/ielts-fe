"use client";

import { useAuth } from "@/contexts/auth-context"
import { LandingPageRoute, SignInRoute } from "@/lib/routes";
import { Link, usePathname, useRouter } from "@/lib/navigation";
import { useLocale, useTranslations } from "next-intl";
import GraduationCapIcon from "./Icons/GraduationCapIcon";
import RoleNav from "./Navbar/RoleNav";
import { Avatar, Dropdown, MenuProps } from "antd";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import LogoutIcon from "./Icons/LogoutIcon";
import GlobalIcon from "./Icons/GlobalIcon";
import ArrowDownIcon from "./Icons/ArrowDownIcon";
import UsaIcon from "./Icons/flags/UsaIcon";
import VietnamIcon from "./Icons/flags/VietnamIcon";

const LOCALES = [
    { code: "vi", label: "Tiếng Việt", icon: <VietnamIcon /> },
    { code: "en", label: "English", icon: <UsaIcon /> },
];

function getInitial(fullName: string): string {
    const parts = fullName.trim().split(/\s+/);
    const lastName = parts[parts.length - 1];
    return lastName.charAt(0).toUpperCase();
}

export default function Header() {
    const { user, setUser } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const locale = useLocale();
    const t = useTranslations("Header");
    const queryClient = useQueryClient();

    const [loading, setLoading] = useState<boolean>(false);
    const [menuOpen, setMenuOpen] = useState<boolean>(false);

    const handleLogout = async () => {
        setLoading(true);

        try {
            await fetch("/api/auth/logout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            });
        } finally {
            queryClient.clear();
            setUser(null);
            router.push(LandingPageRoute);
            setLoading(false);
        }
    };

    const handleChangeLocale = (nextLocale: string) => {
        if (nextLocale === locale) return;
        router.replace(pathname, { locale: nextLocale });
    };

    const items: MenuProps["items"] = [
        {
            key: "language",
            label: t("language"),
            icon: <GlobalIcon width={16} height={16} />,
            children: LOCALES.map(({ code, label, icon }) => ({
                key: code,
                label,
                icon,
                onClick: () => handleChangeLocale(code),
            })),
        },
        {
            key: "logout",
            label: t("logout"),
            icon: <LogoutIcon width={16} height={16} />,
            disabled: loading,
            onClick: handleLogout,
        }
    ];

    return (
        <header className="sticky top-0 z-10 bg-bg border-b border-border">
            <div className="flex items-center justify-between min-h-20 px-6">
                <Link replace href={LandingPageRoute} className="flex items-center gap-2">
                    <span className="flex h-7.5 w-7.5 flex-none items-center justify-center rounded-lg bg-accent">
                        <GraduationCapIcon className="text-white" width={17} height={17} />
                    </span>
                    <span className="font-serif text-base font-bold">IELTS by Phanh</span>
                </Link>

                <RoleNav />

                <div className="flex items-center gap-3">
                    {user ? (
                        <>
                            <Dropdown
                                menu={{ items, selectedKeys: [locale] }}
                                trigger={["click"]}
                                placement="bottomRight"
                                open={menuOpen}
                                onOpenChange={setMenuOpen}
                            >
                                <button
                                    type="button"
                                    className={`flex h-11 cursor-pointer items-center gap-2 rounded-lg border px-2 transition-colors hover:border-accent ${
                                        menuOpen ? "border-accent" : "border-border"
                                    }`}
                                >
                                    <Avatar
                                        size={30}
                                        style={{
                                            backgroundColor: "var(--color-accent-bg)",
                                            color: "var(--color-accent)",
                                            fontWeight: "bold",
                                            fontSize: 14,
                                        }}
                                    >
                                        {getInitial(user.fullName)}
                                    </Avatar>

                                    <span className="text-sm font-medium">{t("account")}</span>

                                    <ArrowDownIcon
                                        width={18}
                                        height={18}
                                        className={`text-muted transition-transform ${menuOpen ? "rotate-180" : ""}`}
                                    />
                                </button>
                            </Dropdown>
                        </>
                    ) : (
                        <Link
                            href={SignInRoute}
                            className="inline-flex h-10 items-center justify-center rounded-lg bg-accent px-5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
                        >
                            {t("signIn")}
                        </Link>
                    )}
                </div>
            </div>
        </header>
    )
}