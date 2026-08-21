"use client";

import { useTranslations } from "next-intl";
import TextInput from "@/components/FormInput/TextInput";
import Button from "@/components/Button";
import GoogleIcon from "@/components/Icons/GoogleIcon";
import useEmailSignIn from "@/hooks/auth/useEmailSignIn";
import useGoogleSignIn from "@/hooks/auth/useGoogleSignIn";

export default function SignInPage() {
    const t = useTranslations("SignInPage");

    const {
        email,
        setEmail,
        password,
        setPassword,
        emailError,
        passwordError,
        loading,
        error,
        handleSubmit,
    } = useEmailSignIn();

    const { googleLoading, handleGoogleSignIn } = useGoogleSignIn();

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

                {error && <p className="text-sm text-error">{error}</p>}

                <Button
                    label={loading ? t("submitLoading") : t("submit")}
                    type="submit"
                    disabled={loading}
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