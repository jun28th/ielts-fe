import { CreateWeekSectionRequest, UpdateWeekSectionRequest, WeekSection } from "@/types/week-section-types";
import { http } from "./http";

export const weekSectionsApi = {
    create: (courseId: string, data: CreateWeekSectionRequest) => http.post<WeekSection>(`/api/week-sections/${courseId}`, data),

    update: (courseId: string, weekSectionId: string, data: UpdateWeekSectionRequest) => http.patch<WeekSection>(`/api/week-sections/${courseId}/${weekSectionId}`, data),

    delete: (courseId: string, weekSectionId: string) => http.delete<void>(`/api/week-sections/${courseId}/${weekSectionId}`),
}