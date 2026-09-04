import { Permission } from "@/types/role-type";
import { http } from "./http";

export const permissionsApi = {
    list: () => http.get<Permission[]>("/api/permissions"),
};