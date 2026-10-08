import { WritingAssignment } from "@/types/writing-assignment-types";
import { http } from "./http";

export const WritingAssignmentApi = {
    getWritingAssignment: (assignmentId: string) => http.get<WritingAssignment>(`/api/writing-assignments/${assignmentId}`)
}