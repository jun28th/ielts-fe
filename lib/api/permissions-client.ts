import { Permission } from "@/types/role-types";
import { http } from "./http";

export const permissionsApi = {
    list: () => http.get<Permission[]>("/api/permissions"),
};