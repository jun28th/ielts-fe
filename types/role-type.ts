export type RoleName = "STUDENT" | "TEACHER" | "ADMIN";

export type Permission = {
    id: string;
    code: string;
    description: string;
}

export type Role = {
    id: string;
    name: string;
    permissions: Permission[];
}