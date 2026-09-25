export type ClassSession = {
    id: string;
    date: string;
    startTime: string;
    endTime: string;
}

export type WeekSection = {
    id: string;
    weekName: string;
    createdAt: string;
    sessions: ClassSession[];
}

export type CreateWeekSectionRequest = {
    weekName: string;
    sessions: Omit<ClassSession, "id">[];
}

export type SessionErrors = {
    date?: string;
    startTime?: string;
    endTime?: string;
}