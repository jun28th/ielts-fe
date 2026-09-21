import { CreateWritingQuestionRequest } from "@/types/writing-question-types";
import { http } from "./http";

export const WritingQuestionApi = {
    create: (payload: CreateWritingQuestionRequest) => {
        const formData = new FormData();

        formData.append("title", payload.title);
        formData.append("prompt", payload.prompt);
        formData.append("taskType", payload.taskType);
        formData.append("difficulty", payload.difficulty);

        if (payload.image) formData.append("image", payload.image);

        return http.post("/api/writing-questions", formData);
    }
}