import { Role } from "@/types/auth-types";
import { jwtVerify, JWTPayload } from "jose";

const secretKey = process.env.JWT_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

export interface SessionPayload extends JWTPayload {
    sub: string;
    fullName: string;
    email: string;
    roles: Role[];
    createdAt: string;
}

export async function decrypt(session: string | undefined = "") {
    try {
        const { payload } = await jwtVerify<SessionPayload>(session, encodedKey, { algorithms: ["HS512"] });
        return payload;
    } catch {
        return null;
    }
}