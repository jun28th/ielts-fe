import { StudentDashboardRoute } from "@/lib/routes";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NO_BG = "bg-transparent hover:bg-transparent focus:bg-transparent active:bg-transparent";

function navLinkClass(active: boolean): string {
    return `${NO_BG} ${active ? "text-accent font-semibold" : "text-fg hover:text-accent"} transition-colors`;
}

export default function StudentNav() {
    const pathname = usePathname();

    const isActive = (href: string) => pathname === href;
    
    return (
        <ul className="menu menu-horizontal gap-1 font-serif">
             <li>
                <Link
                    href={StudentDashboardRoute}
                    replace
                    className={navLinkClass(isActive(StudentDashboardRoute))}
                >
                    Dashboard
                </Link>
            </li>
        </ul>
    );
}