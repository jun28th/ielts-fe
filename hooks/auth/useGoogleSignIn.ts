"use client";

import { useState } from "react";

export default function useGoogleSignIn() {
    const [googleLoading, setGoogleLoading] = useState<boolean>(false);
    const [googleError, setGoogleError] = useState<string | null>(null);

    // Chưa implement Google sign-in, chỉ là ví dụ
    const handleGoogleSignIn = async () => {
        return;
    };

    return {
        googleLoading,
        googleError,
        handleGoogleSignIn,
    };
}