import { CreateWritingAssignmentRequest, GenerateAiCorrectionsRequest, GenerateAiCorrectionsResponse, UpdateWritingAssignmentRequest, WritingAssignment } from "@/types/writing-assignment-types";
import { http } from "./http";

export const WritingAssignmentsApi = {
    createWritingAssignment: (data: CreateWritingAssignmentRequest) => http.post<WritingAssignment>(`/api/writing-assignments`, data),

    getWritingAssignment: (assignmentId: string) => http.get<WritingAssignment>(`/api/writing-assignments/${assignmentId}`),

    updateWritingAssignment: (assignmentId: string, data: UpdateWritingAssignmentRequest) => http.patch<WritingAssignment>(`/api/writing-assignments/${assignmentId}`, data),

    deleteWritingAssignment: (assignmentId: string) => http.delete<void>(`/api/writing-assignments/${assignmentId}`),

    generateAiCorrections: (assignmentId: string, data: GenerateAiCorrectionsRequest) => http.post<GenerateAiCorrectionsResponse>(`/api/writing-assignments/${assignmentId}/ai-corrections`, data)
}