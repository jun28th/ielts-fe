import { useTranslations } from "next-intl";
import Modal from "./Modal";

type CreateWritingAssignmentModalProps = {
    isOpen: boolean;
    onClose: () => void;
    courseId: string;
    weekSectionId: string;
}

export default function CreateWritingAssignmentModal({ isOpen, onClose, courseId, weekSectionId } : CreateWritingAssignmentModalProps) {
    const t = useTranslations("TeacherCourseDetailPage.CreateWritingAssignmentModal");

    const handleClose = () => {
        onClose();
    }

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

    }

    return (
        <Modal
            title={t("title")}
            subtitle={t("subtitle")}
            isOpen={isOpen}
            onClose={handleClose}
            size="2xl"
        >
            <form onSubmit={handleSubmit} className="">

            </form>
        </Modal>
    )
}