export type CourseStatus = "UPCOMING" | "ACTIVE" | "ENDED";

export type Course = {
    id: string;
	name: string;
	startDate: string;
	totalSessions: number;
	minStudents: number;
	maxStudents: number;
	status: CourseStatus;
};

export type CreateCourseRequest = Omit<Course, "id" | "enrolled" | "status">;