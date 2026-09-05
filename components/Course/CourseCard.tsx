import { Course, CourseStatus } from "@/types/course-type"
import { useTranslations } from "next-intl";
import CalendarIcon from "../Icons/CalendarIcon";
import BookIcon from "../Icons/BookIcon";
import { Progress } from "antd";

const STATUS_STYLE: Record<CourseStatus, string> = {
    UPCOMING: "bg-accent-bg text-accent-active",
    ACTIVE: "bg-success-bg text-success",
    ENDED: "bg-surface text-muted border border-border",
};

type CourseCardProps = { 
    course: Course
}

export default function CourseCard({ course } : CourseCardProps) {
    const t = useTranslations("TeacherCoursesPage");

    const percentFill = 1 / course.maxStudents * 100;

    return (
        <div className="group flex cursor-pointer flex-col gap-2.5 rounded-2xl border border-border bg-bg p-5 transition-all duration-150 hover:-translate-y-0.5 hover:border-accent hover:shadow-lg hover:shadow-black/5">
            <div className="flex items-start justify-between gap-2.5">
                <p className="font-serif text-base font-bold">{course.name}</p>

                <p className={`inline-flex items-center h-6 flex-none rounded-full px-2.5 text-xs font-medium whitespace-nowrap ${STATUS_STYLE[course.status]}`}>
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
                        <p className="text-sm">{course.startDate}</p>
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

            <div className="flex flex-col gap-1.5">
                <div className="flex justify-between">
                    <p className="text-muted text-sm">{t("capacityLabel")}</p>
                    <div className="flex items-center gap-1 text-sm font-bold">
                        <p>1</p>
                        <p> / </p>
                        <p>{t("capacityValue", { min: course.minStudents, max: course.maxStudents })}</p>
                    </div>
                </div>
                <Progress percent={percentFill} showInfo={false}/>
            </div>
        </div>
    );
}