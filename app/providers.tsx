import { AuthProvider } from "@/contexts/auth-context";
import { decrypt, SessionPayload } from "@/lib/session";
import { User } from "@/types/auth-types";
import { cookies } from "next/headers";

function payloadToUser(payload: SessionPayload): User {
    return {
        id: payload.sub,
        fullName: payload.fullName,
        email: payload.email,
        roles: payload.roles,
        createdAt: payload.createdAt,
    } as User;
}

async function getInitialUser() : Promise<User | null> {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    
    const payload = await decrypt(accessToken);
    if (!payload) return null;

    return payloadToUser(payload);
}

export default async function Providers({ children } : { children : React.ReactNode}) {
    const initialUser = await getInitialUser();

    return (
        <AuthProvider initialUser={initialUser}>
            {children}
        </AuthProvider>
    );
}