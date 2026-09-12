export type CreateStudentRequest = {
    fullName: string;
    email: string;
    phoneNumber: string;
    courseIds: string[];
}