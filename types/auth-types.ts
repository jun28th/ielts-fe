import { RoleName } from "./role-types";

export type User = {
    id: string;
    fullName: string;
    email: string;
    roles: RoleName[];
    createdAt: string;
};

export type SignInRequest = {
    email: string;
    password: string;
};

export type SignUpRequest = {
    email: string;
    password: string;
    fullName: string;
};

export type AuthResponse = {
    accessToken: string;
    refreshToken: string;
    id: string;
    fullName: string;
    email: string;
    roles: RoleName[];
    createdAt: string;
};