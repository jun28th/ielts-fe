import { WritingQuestion } from "./writing-question-types";

export type CreateWritingAssignmentRequest = {
    writingQuestionId: string;
    dueDate: string;
    description?: string;
}

export type UpdateWritingAssignmentRequest = {
    dueDate?: string;
    description?: string | null;
};

export type WritingAssignment = {
    id: string;
    writingQuestion: WritingQuestion;
    dueDate: string;
    description?: string;
    createdAt: string;
}