"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useMutation } from "@tanstack/react-query";
import TextInput from "@/components/FormInput/TextInput";
import Button from "@/components/Button";
import GoogleIcon from "@/components/Icons/GoogleIcon";
import { useAuth } from "@/contexts/auth-context";
import getRoleDashboardRoute from "@/lib/auth/get-role-dashboard-route";
import { useRouter } from "@/lib/navigation";
import { authApi } from "@/lib/api/auth-client";

export default function SignInPage() {
    const t = useTranslations("SignInPage");
    const router = useRouter();
    const { setUser } = useAuth();

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const [emailError, setEmailError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);

    const [googleLoading, setGoogleLoading] = useState<boolean>(false);

    const { mutate, isPending, error, reset } = useMutation({
        mutationFn: authApi.signIn,
        onSuccess: (user) => {
            setUser(user);
            router.push(getRoleDashboardRoute(user));
        },
    });

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

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        reset();

        if (!validate()) {
            return;
        }

        mutate({ email: email.trim(), password });
    };

    // Chưa implement Google sign-in
    const handleGoogleSignIn = async () => {
        return;
    };

    return (
        <>
            <p className="text-center font-serif text-2xl font-bold text-fg mb-1.5">
                {t("title")}
            </p>
            <p className="text-center text-sm text-muted mb-7">
                {t("subtitle")}
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
                <TextInput
                    label={t("emailLabel")}
                    value={email}
                    onChange={setEmail}
                    placeholder="abc@gmail.com"
                    type="email"
                    error={emailError ?? undefined}
                />

                <TextInput
                    label={t("passwordLabel")}
                    value={password}
                    onChange={setPassword}
                    placeholder="••••••"
                    type="password"
                    error={passwordError ?? undefined}
                />

                {error && (
                    <p className="text-sm text-error">
                        {error.message || t("signInFailed")}
                    </p>
                )}

                <Button
                    label={isPending ? t("submitLoading") : t("submit")}
                    type="submit"
                    disabled={isPending}
                    fullWidth={true}
                />
            </form>

            <div className="my-5.5 flex items-center gap-3 text-[12.5px] text-muted before:h-px before:flex-1 before:bg-border before:content-[''] after:h-px after:flex-1 after:bg-border after:content-['']">
                {t("or")}
            </div>

            <Button
                variant="secondary"
                label={googleLoading ? t("googleConnecting") : "Google"}
                icon={<GoogleIcon width={18} height={18} />}
                onClick={handleGoogleSignIn}
                disabled={googleLoading}
                fullWidth={true}
            />

            <p className="mt-5.5 text-center text-[13.5px] text-muted">
                {t("noAccount")}{" "}
                <span className="font-medium text-accent hover:underline">
                    {t("contactUs")}
                </span>
            </p>
        </>
    );
}