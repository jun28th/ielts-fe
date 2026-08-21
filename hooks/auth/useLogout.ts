"use client";

import { useState } from "react";
import { useRouter } from "@/lib/navigation";
import { useAuth } from "@/contexts/auth-context";
import { LandingPageRoute } from "@/lib/routes";

export function useLogout() {
    const router = useRouter();
    const { setUser } = useAuth();
    const [loading, setLoading] = useState<boolean>(false);

    const handleLogout = async () => {
        setLoading(true);

        try {
            await fetch("/api/auth/logout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            });
        } finally {
            setUser(null);
            router.push(LandingPageRoute);
            setLoading(false);
        }
    };

    return { loading, handleLogout };
}