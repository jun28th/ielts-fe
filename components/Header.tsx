"use client";

import { useAuth } from "@/contexts/auth-context"
import { LandingPageRoute, SignInRoute } from "@/lib/routes";
import Link from "next/link";
import GraduationCapIcon from "./Icons/GraduationCapIcon";

export default function Header() {
    const { user } = useAuth();

    return (
        <header className="sticky top-0 z-10 bg-bg border-b border-border">
            <div className="flex items-center justify-between h-20 p-6">
                <Link replace href={LandingPageRoute} className="flex items-center gap-2">
                    <span className="flex h-7.5 w-7.5 flex-none items-center justify-center rounded-lg bg-accent">
                        <GraduationCapIcon className="text-white" width={17} height={17} />
                    </span>
                    <span className="font-serif text-[17px] font-bold">IELTS by Phanh</span>
                </Link>

                {!user ? (
                    <Link
                        href={SignInRoute}
                        className="inline-flex h-10 items-center justify-center rounded-lg bg-accent px-5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
                    >
                        Đăng nhập
                    </Link>
                ) : (
                    <p className="text-sm text-muted">
                        Welcome, <span className="font-medium text-fg">{user.fullName}</span>
                    </p>
                )}
            </div>
        </header>
    )
}