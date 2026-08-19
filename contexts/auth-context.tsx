"use client";

import { User } from "@/types/auth-types";
import { createContext, ReactNode, useContext, useState } from "react";

type AuthContextType = {
    user: User | null;
    setUser: (user: User | null) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children, initialUser }: { children: ReactNode; initialUser: User | null }) {
    const [user, setUser] = useState<User | null>(initialUser);

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return context;
}