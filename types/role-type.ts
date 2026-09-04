export type RoleName = "STUDENT" | "TEACHER" | "ADMIN";

export type Permission = {
    id: string;
    code: string;
    name: string;
    description: string;
}

export type Role = {
    id: string;
    name: string;
    permissions: Permission[];
}

export type UpdateRoleRequest = {
    name?: string;
    permissionIds?: string[];
}