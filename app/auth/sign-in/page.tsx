"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User } from "@/types/auth-types";
import { useAuth } from "@/contexts/auth-context";
import { AdminHomeRoute, StudentHomeRoute, TeacherHomeRoute } from "@/lib/routes";

export default function SignInPage() {
    const router = useRouter();

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const { setUser } = useAuth();

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();

        setLoading(true);
        setError(null);

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
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <h1 className="text-xl font-semibold text-center mb-2">Sign in</h1>

            <fieldset className="fieldset p-0 w-full">
                <label className="label" htmlFor="email">Email</label>
                <input
                    type="email"
                    id="email"
                    className="input w-full"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </fieldset>

            <fieldset className="fieldset p-0 w-full">
                <label className="label" htmlFor="password">Password</label>
                <input
                    type="password"
                    id="password"
                    className="input w-full"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </fieldset>

            {error && (
                <p className="text-sm text-red-500 -mt-2">{error}</p>
            )}

            <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full"
            >
                {loading ? "Signing in..." : "Sign in"}
            </button>

            <p className="text-sm text-center text-gray-500">
                {"Don't have an account? "}
                <Link replace href="/auth/sign-up" className="text-blue-600 hover:underline">
                    Create an account
                </Link>
            </p>
        </form>
    );
}