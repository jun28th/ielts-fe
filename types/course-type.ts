export type CourseStatus = "UPCOMING" | "ACTIVE" | "ENDED";

export type CourseCreator = {
	id: string;
	fullName: string;
}

export type Course = {
    id: string;
	name: string;
	startDate: string;
	totalSessions: number;
	minStudents: number;
	maxStudents: number;
	status: CourseStatus;
	createdAt: string;
	createdBy: CourseCreator;
};

export type CreateCourseRequest = Omit<Course, "id" | "status" | "createdAt" | "createdBy">;

export type UpdateCourseRequest = Partial<Omit<Course, "id" | "status" | "createdAt" | "createdBy">>;

export type CourseListResponse = {
	content: Course[];
	page: number;
	size: number;
	totalElements: number;
	totalPages: number;
};