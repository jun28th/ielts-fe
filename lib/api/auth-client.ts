import { SignInRequest, User } from "@/types/auth-types";
import { http } from "./http";

export const authApi = {
    signIn: (data: SignInRequest) => http.post<User>("/api/auth/sign-in", data)
}