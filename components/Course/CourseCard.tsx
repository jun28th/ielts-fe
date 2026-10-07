import { Course, STATUS_STYLE } from "@/types/course-types"
import { useTranslations } from "next-intl";
import CalendarIcon from "../Icons/CalendarIcon";
import BookIcon from "../Icons/BookIcon";
import { Progress } from "antd";
import { Link } from "@/lib/navigation";
import { TeacherCourseDetailRoute } from "@/lib/routes";
import { formatDateDDMMYYYY } from "@/lib/utils";
import UserIcon from "../Icons/UserIcon";

type CourseCardProps = { 
    course: Course
}

export default function CourseCard({ course } : CourseCardProps) {
    const t = useTranslations("TeacherCoursesPage.CourseCard");

    const progressPercent = Math.min(Math.round((course.completedSessions / course.totalSessions) * 100), 100);

    return (
        <Link 
            href={TeacherCourseDetailRoute(course.id)}
            className="group flex cursor-pointer flex-col gap-2.5 rounded-2xl border border-border bg-bg p-5 transition-all duration-150 hover:-translate-y-0.5 hover:border-accent hover:shadow-lg hover:shadow-black/5"
        >
            <div className="flex items-start justify-between gap-2.5">
                <p className="font-serif text-base font-bold">{course.name}</p>

                <p className={`inline-flex items-center h-6 flex-none rounded-full px-2.5 text-sm font-medium whitespace-nowrap ${STATUS_STYLE[course.status]}`}>
                    {t(`status.${course.status}`)}
                </p>
            </div>

            <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                    <BookIcon width={14} height={14} className="text-muted"/>
                    <>
                        <p className="text-muted text-sm">
                            {t("teacherLabel")}
                        </p>
                        <p className="text-sm">{"Nguyễn Ngọc Phương Anh"}</p>
                    </>
                </div>

                <div className="flex items-center gap-2">
                    <CalendarIcon width={14} height={14} className="text-muted"/>
                    <>
                        <p className="text-muted text-sm">
                            {t("startDateLabel")}
                        </p>
                        <p className="text-sm">{formatDateDDMMYYYY(course.startDate)}</p>
                    </>
                </div>

                <div className="flex items-center gap-2">
                    <UserIcon width={14} height={14} className="text-muted"/>
                    <>
                        <p className="text-muted text-sm">{t("capacityLabel")}</p>
                        <div className="flex items-center gap-1 text-sm">
                            <p>{course.enrolledCount}</p>
                            <p> / </p>
                            <p>{t("capacityValue", { min: course.minStudents, max: course.maxStudents })}</p>
                        </div>
                    </>
                </div>
            </div>

            <div className="flex flex-col gap-1.5">
                <div className="flex items-baseline justify-between gap-3">
                    <p className="text-sm text-muted">{t("progressLabel")}</p>
                    <p className="whitespace-nowrap text-sm font-bold">
                        {t("progressValue", { completed: course.completedSessions, total: course.totalSessions })}
                    </p>
                </div>
                <Progress percent={progressPercent} showInfo={false} />
            </div>
        </Link>
    );
}