"use client";

import { useAuth } from "@/contexts/auth-context";
import getRoleDashboardRoute from "@/lib/auth/get-role-dashboard-route";
import { useRouter } from "@/lib/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";

export default function useEmailSignIn() {
    const router = useRouter();
    const t = useTranslations("SignInPage");
    const { setUser } = useAuth();

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const [emailError, setEmailError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const validate = () => {
        let valid = true;

        if (!email.trim()) {
            setEmailError(t("emailRequired"));
            valid = false;
        } else {
            setEmailError(null);
        }

        if (!password) {
            setPasswordError(t("passwordRequired"));
            valid = false;
        } else {
            setPasswordError(null);
        }

        return valid;
    };

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        setError(null);

        if (!validate()) {
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/auth/sign-in", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message ?? t("signInFailed"));
            }

            setUser(data);
            router.push(getRoleDashboardRoute(data));
        } catch (err) {
            setError(err instanceof Error ? err.message : t("genericError"));
        } finally {
            setLoading(false);
        }
    };

    return { 
        email, 
        setEmail, 
        password, 
        setPassword, 
        emailError, 
        passwordError, 
        loading, 
        error, 
        handleSubmit 
    };
}