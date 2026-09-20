"use client";

import { useTranslations } from "next-intl";
import Modal from "./Modal";

type CreateWritingQuestionModalProps = {
    isOpen: boolean;
    onClose: () => void;
}

export default function CreateWritingQuestionModal({ isOpen, onClose } : CreateWritingQuestionModalProps) {
    const t = useTranslations("QuestionBankWritingPage.CreateWritingQuestionModal");

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
            <form onSubmit={handleSubmit}>

            </form>
        </Modal>
    )
}