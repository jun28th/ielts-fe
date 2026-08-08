import Button from "@/components/Button";
import PlusIcon from "@/components/Icons/PlusIcon";

export default function CoursesPage() {

    return (
        <>
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-serif font-bold text-2xl mb-1">
                        Khoá học
					</h1>
					<p className="text-muted text-sm">
                        Danh sách khóa học bạn đang phụ trách.
                    </p>
                </div>
                <Button
                    variant="primary"
                    label="Tạo khoá học mới"
                    icon={<PlusIcon className="text-white" width={20} height={20}/>}
                />
            </div>
        </>
    )
}