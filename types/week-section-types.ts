export type SessionTime = {
    id: string;
    date: string;
    startTime: string;
    endTime: string;
}

export type WeekSection = {
    id: string;
    weekName: string;
    createdAt: string;
    sessions: SessionTime[];
}

export type CreateWeekSectionRequest = {
    weekName: string;
    sessions: Omit<SessionTime, "id">[];
}