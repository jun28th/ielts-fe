"use client";

import { useAuth } from "@/contexts/auth-context";
import { AdminHomeRoute, StudentHomeRoute, TeacherHomeRoute } from "@/lib/routes";
import { Gender, User } from "@/types/auth-types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignUpPage() {
    const router = useRouter();

    const [fullName, setFullName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [gender, setGender] = useState<Gender>("MALE");

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const { setUser } = useAuth();

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();

        setLoading(true);
        setError(null);
        
        try {
            const res = await fetch("/api/auth/sign-up", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ fullName, email, password, gender }),
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
            <h1 className="text-xl font-semibold text-center mb-2">Sign up</h1>

            <fieldset className="fieldset p-0 w-full">
                <label className="label" htmlFor="name">Full Name</label>
                <input
                    type="text"
                    id="name"
                    className="input w-full"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                />
            </fieldset>

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

            <fieldset className="fieldset p-0 w-full">
                <label className="label">Gender</label>
                <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="gender"
                            value="MALE"
                            className="radio"
                            checked={gender === "MALE"}
                            onChange={(e) => setGender(e.target.value as Gender)}
                        />
                        Male
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="gender"
                            value="FEMALE"
                            className="radio"
                            checked={gender === "FEMALE"}
                            onChange={(e) => setGender(e.target.value as Gender)}
                        />
                        Female
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="gender"
                            value="OTHER"
                            className="radio"
                            checked={gender === "OTHER"}
                            onChange={(e) => setGender(e.target.value as Gender)}
                        />
                        Other
                    </label>
                </div>
            </fieldset>

            {error && (
                <p className="text-sm text-red-500 -mt-2">
                    {error}
                </p>
            )}

            <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full"
            >
                {loading ? "Signing up..." : "Sign up"}
            </button>

            <p className="text-sm text-center text-gray-500">
                {"Already have an account? "}
                <Link replace href="/auth/sign-in" className="text-blue-600 hover:underline">
                    Sign in
                </Link>
            </p>
        </form>
    )
}