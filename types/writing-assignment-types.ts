import { WritingQuestion } from "./writing-question-types";

export type Criterion = "TR" | "CC" | "LR" | "GRA";

export type CriterionFilter = "ALL" | Criterion;

export type CorrectionType = "replace" | "delete" | "insert" | "comment";

export const CRITERION_STYLES: Record<Criterion, { active: string; hover: string; badge: string }> = {
    TR: {
        active: "bg-tr-bg text-tr inset-ring-2 inset-ring-tr",
        hover: "hover:bg-tr-bg/60 hover:text-tr",
        badge: "bg-tr-bg text-tr",
    },
    CC: {
        active: "bg-cc-bg text-cc inset-ring-2 inset-ring-cc",
        hover: "hover:bg-cc-bg/60 hover:text-cc",
        badge: "bg-cc-bg text-cc",
    },
    LR: {
        active: "bg-lr-bg text-lr inset-ring-2 inset-ring-lr",
        hover: "hover:bg-lr-bg/60 hover:text-lr",
        badge: "bg-lr-bg text-lr",
    },
    GRA: {
        active: "bg-gra-bg text-gra inset-ring-2 inset-ring-gra",
        hover: "hover:bg-gra-bg/60 hover:text-gra",
        badge: "bg-gra-bg text-gra",
    },
};

export type CreateWritingAssignmentRequest = {
    weekSectionId: string;
    writingQuestionId: string;
    dueDate: string;
    dueTime: string;
    description?: string;
}

export type UpdateWritingAssignmentRequest = {
    dueDate?: string;
    dueTime?: string;
    description?: string | null;
};

export type WritingAssignment = {
    id: string;
    writingQuestion: WritingQuestion;
    dueDate: string;
    dueTime: string;
    description?: string;
    createdAt: string;
}