export type CourseStatus = "UPCOMING" | "ACTIVE" | "ENDED";

export type Course = {
    id: string;
	name: string;
	startDate: string;
	totalSessions: number;
	minStudents: number;
	maxStudents: number;
	status: CourseStatus;
	createdAt: string;
	enrolledCount: number;
};

export type CreateCourseRequest = Omit<Course, "id" | "status" | "createdAt" | "enrolledCount">;

export type UpdateCourseRequest = Partial<Omit<Course, "id" | "status" | "createdAt" | "enrolledCount">>;

export type CourseListResponse = {
	content: Course[];
	page: number;
	size: number;
	totalElements: number;
	totalPages: number;
};