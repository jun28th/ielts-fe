import { http } from "./http";
import { Role, UpdateRoleRequest } from "@/types/role-type";

export const rolesApi = {
    list: () => http.get<Role[]>("/api/roles"),
    update: (roleId: string, data: UpdateRoleRequest) => http.patch<Role>(`/api/roles/${roleId}`, data),
};