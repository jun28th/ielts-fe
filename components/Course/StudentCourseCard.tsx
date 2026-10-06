import { Link } from "@/lib/navigation";
import { StudentCourseDetailRoute } from "@/lib/routes";
import { STATUS_STYLE, StudentCourse } from "@/types/course-types";
import { useTranslations } from "next-intl";
import CalendarIcon from "../Icons/CalendarIcon";
import { formatDateDDMMYYYY } from "@/lib/utils";
import BookIcon from "../Icons/BookIcon";

type StudentCourseCardProps = {
    course: StudentCourse;
}

export default function StudentCourseCard({ course } : StudentCourseCardProps) {
    const t = useTranslations("StudentCoursesPage");

    return (
        <Link
            href={StudentCourseDetailRoute(course.id)}
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
                    <CalendarIcon width={14} height={14} className="text-muted"/>
                    <>
                        <p className="text-muted text-sm">
                            {t("startDateLabel")}
                        </p>
                        <p className="text-sm">{formatDateDDMMYYYY(course.startDate)}</p>
                    </>
                </div>

                <div className="flex items-center gap-2">
                    <BookIcon width={14} height={14} className="text-muted"/>
                    <>
                        <p className="text-muted text-sm">
                            {t("sessionsLabel")}
                        </p>
                        <p className="text-sm">{course.totalSessions}</p>
                    </>
                </div>
            </div>
        </Link>
    )
}