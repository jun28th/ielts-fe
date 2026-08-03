"use client";

import { useAuth } from "@/contexts/auth-context"

export default function Header() {
    const { user } = useAuth();

    return (
        <header className="border-b border-cream-dark bg-cream">
            <div className="flex items-center justify-between px-6 py-4">
                <p className="font-serif text-xl font-medium text-ink">
                    IELTS Startup
                </p>

                <p>
                    {user ? `Welcome, ${user.fullName}` : "Not signed in"}
                </p>
            </div>
        </header>
    )
}