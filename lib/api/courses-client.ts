import { Course, CourseListResponse, CourseStatus, CreateCourseRequest, UpdateCourseRequest } from "@/types/course-type";
import { http } from "./http";

type ListCoursesParams = {
    page: number,
    size: number,
    status?: CourseStatus
}

function buildQuery(params: ListCoursesParams): string {
    const searchParams = new URLSearchParams({
        page: String(params.page),
        size: String(params.size),
    });

    if (params.status) {
        searchParams.set("status", params.status);
    }

    return searchParams.toString();
}

export const coursesApi = {
    create: (data: CreateCourseRequest) => http.post<Course>("/api/courses", data),
    list: (params: ListCoursesParams) => http.get<CourseListResponse>(`/api/courses?${buildQuery(params)}`),
    get: (courseId: string) => http.get<Course>(`/api/courses/${courseId}`),
    update: (courseId: string, data: UpdateCourseRequest) => http.patch<Course>(`/api/courses/${courseId}`, data),
    delete: (courseId: string) => http.delete<void>(`/api/courses/${courseId}`)
}