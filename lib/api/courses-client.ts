import { Course, CourseListResponse, CourseStatus, CreateCourseRequest, StudentCourse, StudentCourseListResponse, UpdateCourseRequest } from "@/types/course-types";
import { http } from "./http";
import { CreateWeekSectionRequest, UpdateWeekSectionRequest, WeekSection } from "@/types/week-section-types";
import { CreateWritingAssignmentRequest, UpdateWritingAssignmentRequest, WritingAssignment } from "@/types/writing-assignment-types";

type CourseStatusFilter = CourseStatus | "NOT_ENDED";

type ListCoursesParams = {
    page: number,
    size: number,
    status?: CourseStatusFilter
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
    createCourse: (data: CreateCourseRequest) => http.post<Course>("/api/courses", data),

    listCourses: (params: ListCoursesParams) => http.get<CourseListResponse>(`/api/courses?${buildQuery(params)}`),

    getCourse: (courseId: string) => http.get<Course>(`/api/courses/${courseId}`),

    updateCourse: (courseId: string, data: UpdateCourseRequest) => http.patch<Course>(`/api/courses/${courseId}`, data),

    deleteCourse: (courseId: string) => http.delete<void>(`/api/courses/${courseId}`),

    listEnrollable: (params: Omit<ListCoursesParams, "status">) => coursesApi.listCourses({ ...params, status: "NOT_ENDED" }),

    // === Student Courses ===

    listEnrolled: (params: ListCoursesParams) => http.get<StudentCourseListResponse>(`/api/courses/enrolled?${buildQuery(params)}`),

    getEnrolled: (courseId: string) => http.get<StudentCourse>(`/api/courses/enrolled/${courseId}`),

    // === Week Sections ===

    createWeekSection: (courseId: string, data: CreateWeekSectionRequest) => http.post<WeekSection>(`/api/courses/${courseId}/week-sections`, data),

    updateWeekSection: (courseId: string, weekSectionId: string, data: UpdateWeekSectionRequest) => http.patch<WeekSection>(`/api/courses/${courseId}/week-sections/${weekSectionId}`, data),

    deleteWeekSection: (courseId: string, weekSectionId: string) => http.delete<void>(`/api/courses/${courseId}/week-sections/${weekSectionId}`),

    // === Writing Assignments ===

    createWritingAssignment: (courseId: string, weekSectionId: string, data: CreateWritingAssignmentRequest) => http.post<WritingAssignment>(`/api/courses/${courseId}/week-sections/${weekSectionId}/writing-assignments`, data),

    updateWritingAssignment: (courseId: string, weekSectionId: string, assignmentId: string, data: UpdateWritingAssignmentRequest) => http.patch<WritingAssignment>(`/api/courses/${courseId}/week-sections/${weekSectionId}/writing-assignments/${assignmentId}`, data),

    deleteWritingAssignment: (courseId: string, weekSectionId: string, assignmentId: string) => http.delete<void>(`/api/courses/${courseId}/week-sections/${weekSectionId}/writing-assignments/${assignmentId}`),
}