import { Course, CreateCourseRequest } from "@/types/course-type";
import { http } from "./http";

export const coursesApi = {
    create: (data: CreateCourseRequest) => http.post<Course>("/api/courses", data),
    list: () => http.get<Course[]>("/api/courses"),
}