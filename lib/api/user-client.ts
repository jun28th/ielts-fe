import { CreateStudentRequest } from "@/types/user-types";
import { http } from "./http";

export const userApi = {
    createStudentAccount: (data: CreateStudentRequest) => http.post<void>("/api/users/students", data)
};