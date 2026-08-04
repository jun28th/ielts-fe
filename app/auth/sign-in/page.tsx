"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/types/auth-types";
import { useAuth } from "@/contexts/auth-context";
import { AdminHomeRoute, StudentHomeRoute, TeacherHomeRoute } from "@/lib/routes";
import TextInput from "@/components/FormInput/TextInput";
import Button from "@/components/Button";
import GoogleIcon from "@/components/Icons/GoogleIcon";

export default function SignInPage() {
    const router = useRouter();

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const [emailError, setEmailError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);

    const [loading, setLoading] = useState<boolean>(false);
    const [googleLoading, setGoogleLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const { setUser } = useAuth();

    const validate = () => {
        let valid = true;

        if (!email.trim()) {
            setEmailError("Vui lòng nhập email");
            valid = false;
        } else {
            setEmailError(null);
        }

        if (!password) {
            setPasswordError("Vui lòng nhập mật khẩu");
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
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message ?? "Sign in failed");
            }

            setUser(data);

            redirectByRole(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    // Chưa implement Google sign-in, chỉ là ví dụ
    const handleGoogleSignIn = async () => {
        setError(null);
        setGoogleLoading(true);

        try {
            const res = await fetch("/api/auth/google-sign-in", {
                method: "GET",
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message ?? "Google sign in failed");
            }

            setUser(data);

            redirectByRole(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setGoogleLoading(false);
        }
    };

    const redirectByRole = (user: User) => {
        if (user.roles.includes("ADMIN")) {
            router.push(AdminHomeRoute);
        } else if (user.roles.includes("TEACHER")) {
            router.push(TeacherHomeRoute);
        } else {
            router.push(StudentHomeRoute);
        }
    };

    return (
        <>
            <p className="text-center font-serif text-2xl font-bold text-fg mb-1.5">
                Đăng nhập
            </p>
            <p className="text-center text-sm text-muted mb-7">
                Truy cập vào tài khoản của bạn để tiếp tục.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
                <TextInput
                    label="Email"
                    value={email}
                    onChange={setEmail}
                    placeholder="abc@gmail.com"
                    type="email"
                    error={emailError ?? undefined} 
                />

                <TextInput
                    label="Mật khẩu"
                    value={password}
                    onChange={setPassword}
                    placeholder="••••••"
                    type="password"
                    error={passwordError ?? undefined}
                />

                {error && <p className="text-sm text-error">{error}</p>}

                <Button
                    label={loading ? "Đang đăng nhập..." : "Đăng nhập"}
                    type="submit"
                    disabled={loading}
                />
            </form>

            <div className="my-5.5 flex items-center gap-3 text-[12.5px] text-muted before:h-px before:flex-1 before:bg-border before:content-[''] after:h-px after:flex-1 after:bg-border after:content-['']">
                Hoặc
            </div>

            <Button
                variant="secondary"
                label={googleLoading ? "Đang kết nối..." : "Google"}
                icon={<GoogleIcon width={18} height={18} />}
                onClick={handleGoogleSignIn}
                disabled={googleLoading}
            />

            <p className="mt-5.5 text-center text-[13.5px] text-muted">
                Chưa có tài khoản?{" "}
                <span className="font-medium text-accent hover:underline">
                    Liên hệ IELTS by Phanh
                </span>
            </p>
        </>
    );
}