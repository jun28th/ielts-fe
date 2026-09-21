"use client";

import { WritingQuestion } from "@/types/writing-question-types";
import Modal from "./Modal";
import { useTranslations } from "next-intl";

type UpdateWritingQuestionModalProps = {
    question: WritingQuestion
    isOpen: boolean;
    onClose: () => void;
}

export default function UpdateWritingQuestionModal({ question, isOpen, onClose } : UpdateWritingQuestionModalProps) {
    const t = useTranslations("QuestionBankWritingPage.UpdateWritingQuestionModal");


    const handleClose = () => {
        onClose();
    }

    return (
        <Modal
            title={t("title")}
            subtitle={t("subtitle")}
            isOpen={isOpen}
            onClose={handleClose}
            size="2xl"
        >
            <form>

            </form>
        </Modal>
    )
}