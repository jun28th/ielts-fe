import { getTranslations } from "next-intl/server";
import { LandingPageRoute } from "@/lib/routes";
import GraduationCapIcon from "./Icons/GraduationCapIcon";
import MailIcon from "./Icons/MailIcon";
import PhoneIcon from "./Icons/PhoneIcon";
import { Link } from "@/lib/navigation";

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

export default async function Footer() {
    const t = await getTranslations("Footer");

    const FOOTER_COLUMNS = [
        {
            title: t("columns.program.title"),
            links: [
                { label: t("columns.program.links.courses"), href: "#" },
                { label: t("columns.program.links.examBank"), href: "#" },
                { label: t("columns.program.links.studentList"), href: "#" },
            ],
        },
        {
            title: t("columns.resources.title"),
            links: [
                { label: t("columns.resources.links.mockTests"), href: "#" },
                { label: t("columns.resources.links.vocabulary"), href: "#" },
                { label: t("columns.resources.links.blog"), href: "#" },
            ],
        },
        {
            title: "IELTS by Phanh",
            links: [
                { label: t("columns.about.links.aboutUs"), href: "#" },
                { label: t("columns.about.links.teachers"), href: "#" },
                { label: t("columns.about.links.careers"), href: "#" },
            ],
        },
    ];

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
                        {t("tagline")}
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
                    {t("copyright")}
                </p>
                <div className="flex gap-4.5">
                    <Link href="#" className="text-[12.5px] text-muted hover:text-accent hover:underline">
                        {t("terms")}
                    </Link>
                    <Link href="#" className="text-[12.5px] text-muted hover:text-accent hover:underline">
                        {t("privacy")}
                    </Link>
                </div>
            </div>
        </footer>
    )
}