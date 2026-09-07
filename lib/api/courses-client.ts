import { Course, CourseListResponse, CreateCourseRequest } from "@/types/course-type";
import { http } from "./http";

type ListCoursesParams = {
    page: number,
    size: number
}

function buildQuery(params: ListCoursesParams): string {
    const searchParams = new URLSearchParams({
        page: String(params.page),
        size: String(params.size),
    });

    return searchParams.toString();
}

export const coursesApi = {
    create: (data: CreateCourseRequest) => http.post<Course>("/api/courses", data),
    list: (params: ListCoursesParams) => http.get<CourseListResponse>(`/api/courses?${buildQuery(params)}`),
}