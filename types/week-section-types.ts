export type ClassSession = {
    id: string;
    date: string;
    startTime: string;
    endTime: string;
    isNew?: boolean;
}

export type WeekSection = {
    id: string;
    weekName: string;
    createdAt: string;
    sessions: ClassSession[];
}

export type CreateWeekSectionRequest = {
    weekName: string;
    sessions: Omit<ClassSession, "id" | "isNew">[];
}

export type UpdateSessionRequest = {
    id: string | null;
    date: string;
    startTime: string;
    endTime: string;
}

export type UpdateWeekSectionRequest = {
    weekName: string;
    sessions: UpdateSessionRequest[];
}

export type SessionErrors = {
    date?: string;
    startTime?: string;
    endTime?: string;
}