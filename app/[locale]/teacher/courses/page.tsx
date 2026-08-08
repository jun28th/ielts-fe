import { getTranslations } from "next-intl/server";
import Button from "@/components/Button";
import PlusIcon from "@/components/Icons/PlusIcon";

export default async function CoursesPage() {
    const t = await getTranslations("TeacherCoursesPage");

    return (
        <>
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-serif font-bold text-2xl mb-1">
                        {t("title")}
					</h1>
					<p className="text-muted text-sm">
                        {t("subtitle")}
                    </p>
                </div>
                <Button
                    variant="primary"
                    label={t("createButton")}
                    icon={<PlusIcon className="text-white" width={20} height={20}/>}
                />
            </div>
        </>
    )
}