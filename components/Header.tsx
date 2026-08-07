"use client";

import { useAuth } from "@/contexts/auth-context"
import { LandingPageRoute, SignInRoute } from "@/lib/routes";
import Link from "next/link";
import GraduationCapIcon from "./Icons/GraduationCapIcon";
import Button from "./Button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import TeacherNav from "./Navbar/TeacherNav";

function getInitial(fullName: string): string {
    const parts = fullName.trim().split(/\s+/);
    const lastName = parts[parts.length - 1];
    return lastName.charAt(0).toUpperCase();
}

export default function Header() {
    const { user, setUser } = useAuth();
    const router = useRouter();

    const [loading, setLoading] = useState<boolean>(false);

    const handleLogout = async () => {
        setLoading(true);

        try {
            await fetch("/api/auth/logout", {
                method: "POST",
                headers: { "Content-Type": "application/json" }
            });
        } finally {
            setUser(null);
            router.push(LandingPageRoute);
            setLoading(false);
        }
    }

    return (
        <header className="sticky top-0 z-10 bg-bg border-b border-border">
            <div className="navbar min-h-20 px-6">
                <div className="navbar-start">
                    <Link replace href={LandingPageRoute} className="flex items-center gap-2">
                        <span className="flex h-7.5 w-7.5 flex-none items-center justify-center rounded-lg bg-accent">
                            <GraduationCapIcon className="text-white" width={17} height={17} />
                        </span>
                        <span className="font-serif text-[17px] font-bold">IELTS by Phanh</span>
                    </Link>
                </div>

                <div className="navbar-center">
                    <TeacherNav />
                </div>

                <div className="navbar-end gap-3">
                    {user ? (
                        <>
                            <div className="avatar avatar-placeholder">
                                <div className="w-10 rounded-full bg-accent-bg">
                                    <p className="text-accent font-bold">{getInitial(user.fullName)}</p>
                                </div>
                            </div>

                            <Button
                                label="Đăng xuất"
                                variant="secondary"
                                onClick={handleLogout}
                                disabled={loading}
                            />
                        </>
                    ) : (
                        <Link
                            href={SignInRoute}
                            className="inline-flex h-10 items-center justify-center rounded-lg bg-accent px-5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
                        >
                            Đăng nhập
                        </Link>
                    )}
                </div>
            </div>
        </header>
    )
}