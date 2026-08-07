import { 
    TeacherClassesRoute,
    TeacherDashboardRoute, 
    TeacherQuestionBankListeningRoute, 
    TeacherQuestionBankReadingRoute, 
    TeacherQuestionBankRoute, 
    TeacherQuestionBankSpeakingRoute, 
    TeacherQuestionBankWritingRoute, 
    TeacherStudentsRoute
} from "@/lib/routes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const QUESTION_BANK_ITEMS = [
    { href: TeacherQuestionBankListeningRoute, label: "Kho đề Listening" },
    { href: TeacherQuestionBankReadingRoute, label: "Kho đề Reading" },
    { href: TeacherQuestionBankWritingRoute, label: "Kho đề Writing" },
    { href: TeacherQuestionBankSpeakingRoute, label: "Kho đề Speaking" },
];

const NO_BG = "bg-transparent hover:bg-transparent focus:bg-transparent active:bg-transparent";

function navLinkClass(active: boolean): string {
    return `${NO_BG} ${active ? "text-accent font-semibold" : "text-fg hover:text-accent"} transition-colors`;
}

export default function TeacherNav() {
    const pathname = usePathname();
    const detailsRef = useRef<HTMLDetailsElement>(null);

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
                    className={navLinkClass(isActive(TeacherDashboardRoute))}
                >
                    Dashboard
                </Link>
            </li>

            <li>
                <Link
                    href={TeacherClassesRoute}
                    className={navLinkClass(isActive(TeacherClassesRoute))}
                >
                    Lớp học
                </Link>
            </li>

            <li>
                <details ref={detailsRef}>
                    <summary className={navLinkClass(isQuestionBankActive)}>
                        Kho đề
                    </summary>

                    <ul className="z-20 w-52 rounded-box bg-bg p-2 shadow border border-border">
                        {QUESTION_BANK_ITEMS.map((item) => (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={navLinkClass(isActive(item.href))}
                                >
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </details>
            </li>

            <li>
                <Link
                    href={TeacherStudentsRoute}
                    className={navLinkClass(isActive(TeacherStudentsRoute))}
                >
                    Danh sách học viên
                </Link>
            </li>
        </ul>
    );
}