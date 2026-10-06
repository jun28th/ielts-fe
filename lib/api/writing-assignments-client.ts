import { CreateWritingAssignmentRequest, UpdateWritingAssignmentRequest, WritingAssignment } from "@/types/writing-assignment-types";
import { http } from "./http";

export const writingAssignmentsApi = {
    create: (courseId: string, weekSectionId: string, data: CreateWritingAssignmentRequest) => http.post<WritingAssignment>(`/api/writing-assignments/${courseId}/${weekSectionId}`, data),

    update: (courseId: string, weekSectionId: string, assignmentId: string, data: UpdateWritingAssignmentRequest) => http.patch<WritingAssignment>(`/api/writing-assignments/${courseId}/${weekSectionId}/${assignmentId}`, data),

    delete: (courseId: string, weekSectionId: string, assignmentId: string) => http.delete<void>(`/api/writing-assignments/${courseId}/${weekSectionId}/${assignmentId}`),
}