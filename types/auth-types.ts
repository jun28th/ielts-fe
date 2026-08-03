export type Gender = "MALE" | "FEMALE" | "OTHER";
export type Role = "STUDENT" | "TEACHER" | "ADMIN";

export type User = {
    id: string;
    fullName: string;
    gender: Gender;
    email: string;
    roles: Role[];
    createdAt: string;
};

export type SignInInput = {
    email: string;
    password: string;
};

export type SignUpInput = {
    email: string;
    password: string;
    fullName: string;
    gender: Gender;
};

export type AuthResponse = {
    accessToken: string;
    refreshToken: string;
    id: string;
    fullName: string;
    gender: Gender;
    email: string;
    roles: Role[];
    createdAt: string;
};