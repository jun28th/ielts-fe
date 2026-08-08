"use client";

import { 
    TeacherCoursesRoute,
    TeacherDashboardRoute, 
    TeacherQuestionBankListeningRoute, 
    TeacherQuestionBankReadingRoute, 
    TeacherQuestionBankRoute, 
    TeacherQuestionBankSpeakingRoute, 
    TeacherQuestionBankWritingRoute, 
    TeacherStudentsRoute
} from "@/lib/routes";
import { Link } from "@/lib/navigation";
import { usePathname } from "@/lib/navigation"; 
import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";

const QUESTION_BANK_ITEMS = [
    { href: TeacherQuestionBankListeningRoute, labelKey: "listening" },
    { href: TeacherQuestionBankReadingRoute, labelKey: "reading" },
    { href: TeacherQuestionBankWritingRoute, labelKey: "writing" },
    { href: TeacherQuestionBankSpeakingRoute, labelKey: "speaking" },
];

const NO_BG = "bg-transparent hover:bg-transparent focus:bg-transparent active:bg-transparent";

function navLinkClass(active: boolean): string {
    return `${NO_BG} ${active ? "text-accent font-semibold" : "text-fg hover:text-accent"} transition-colors`;
}

export default function TeacherNav() {
    const pathname = usePathname();
    const detailsRef = useRef<HTMLDetailsElement>(null);
    const t = useTranslations("TeacherNav");

    // Đổi trang thì đóng dropdown lại.
    // <details> không tự đóng khi click Link -> phải làm tay
    useEffect(() => {
        if (detailsRef.current) detailsRef.current.open = false;
    }, [pathname]);

    const isActive = (href: string) => pathname === href;
    const isQuestionBankActive = pathname.startsWith(TeacherQuestionBankRoute);

    return (
        <ul className="menu menu-horizontal gap-1 font-serif">
             <li>
                <Link
                    href={TeacherDashboardRoute}
                    replace
                    className={navLinkClass(isActive(TeacherDashboardRoute))}
                >
                    {t("dashboard")}
                </Link>
            </li>

            <li>
                <Link
                    href={TeacherCoursesRoute}
                    replace
                    className={navLinkClass(isActive(TeacherCoursesRoute))}
                >
                    {t("courses")}
                </Link>
            </li>

            <li>
                <details ref={detailsRef}>
                    <summary className={navLinkClass(isQuestionBankActive)}>
                        {t("questionBank")}
                    </summary>

                    <ul className="z-20 w-52 rounded-box bg-bg p-2 shadow border border-border">
                        {QUESTION_BANK_ITEMS.map((item) => (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    replace
                                    className={navLinkClass(isActive(item.href))}
                                >
                                    {t(`questionBankItems.${item.labelKey}`)}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </details>
            </li>

            <li>
                <Link
                    href={TeacherStudentsRoute}
                    replace
                    className={navLinkClass(isActive(TeacherStudentsRoute))}
                >
                    {t("students")}
                </Link>
            </li>
        </ul>
    );
}