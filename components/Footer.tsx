import { LandingPageRoute } from "@/lib/routes";
import Link from "next/link";
import GraduationCapIcon from "./Icons/GraduationCapIcon";
import MailIcon from "./Icons/MailIcon";
import PhoneIcon from "./Icons/PhoneIcon";

const CONTACT_ITEMS = [
    {
        label: "hotro@ieltsbyphanh.vn",
        icon: <MailIcon className="text-muted" width={17} height={17} />
    },
    {
        label: "1900 1234",
        icon: <PhoneIcon className="text-muted" width={17} height={17} />
    }
];

const FOOTER_COLUMNS = [
    {
        title: "Chương trình",
        links: [
            { label: "Khoá học", href: "#" },
            { label: "Kho đề", href: "#" },
            { label: "Danh sách học viên", href: "#" },
        ],
    },
    {
        title: "Tài nguyên",
        links: [
            { label: "Đề thi thử", href: "#" },
            { label: "Từ vựng theo chủ đề", href: "#" },
            { label: "Blog học thuật", href: "#" },
        ],
    },
    {
        title: "IELTS by Phanh",
        links: [
            { label: "Về chúng tôi", href: "#" },
            { label: "Đội ngũ giáo viên", href: "#" },
            { label: "Tuyển dụng", href: "#" },
        ],
    },
];

export default function Footer() {

    return (
        <footer className="border-t border-border bg-bg pt-10">
            <div className="mx-auto max-w-6xl grid grid-cols-1 gap-8 px-7 pb-8 sm:grid-cols-[1.6fr_1fr_1fr_1fr]">

                {/* Brand column */}
                <div className="flex flex-col gap-4">
                    <Link href={LandingPageRoute} className="flex items-center gap-2">
                        <span className="flex h-7.5 w-7.5 flex-none items-center justify-center rounded-lg bg-accent">
                            <GraduationCapIcon className="text-white" width={17} height={17} />
                        </span>
                        <span className="font-serif text-base font-bold">IELTS by Phanh</span>
                    </Link>

                    <p className="max-w-[34ch] text-[13.5px] leading-relaxed text-muted">
                        Nền tảng học IELTS — lộ trình cá nhân hoá, giáo viên đồng hành, theo dõi tiến độ từng kỹ năng cho học viên.
                    </p>

                    <ul className="flex flex-col gap-2">
                        {CONTACT_ITEMS.map((item) => (
                            <li key={item.label} className="flex items-center gap-2 text-[13.5px] text-muted">
                                {item.icon}
                                <span>{item.label}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Nav columns */}
                {FOOTER_COLUMNS.map((col) => (
                    <nav key={col.title} className="flex flex-col gap-2.5">
                        <p className="mb-1 text-[13.5px] font-bold text-fg">{col.title}</p>
                        {col.links.map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                className="text-[13.5px] text-muted hover:text-accent"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                ))}
            </div>

            {/* Bottom bar */}
            <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 border-t border-border px-7 py-4">
                <p className="text-[12.5px] text-muted">
                    © 2026 IELTS by Phanh. Bảo lưu mọi quyền.
                </p>
                <div className="flex gap-4.5">
                    <Link href="#" className="text-[12.5px] text-muted hover:text-accent hover:underline">
                        Điều khoản
                    </Link>
                    <Link href="#" className="text-[12.5px] text-muted hover:text-accent hover:underline">
                        Bảo mật
                    </Link>
                </div>
            </div>
        </footer>
    )
}