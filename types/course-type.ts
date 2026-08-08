export type CourseStatus = "upcoming" | "active" | "ended";

export type Course = {
    id: string;
	code: string;
	name: string;
	startDate: string;
	totalSessions: number;
	minStudents: number;
	maxStudents: number;
	enrolled: number;
	status: CourseStatus;
};