import { useEffect } from "react";
import CloseIcon from "../Icons/CloseIcon";

type ModalSize = "sm" | "md" | "lg" | "xl";

const SIZE_CLASS: Record<ModalSize, string> = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
}

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    subtitle?: string;
    size?: ModalSize;
    children: React.ReactNode;
};

export default function Modal({ isOpen, onClose, title, subtitle, size = "lg", children } : ModalProps) {
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/45 p-6">
            <div className={`w-full ${SIZE_CLASS[size]} max-h-[90vh] overflow-y-auto rounded-2xl bg-bg p-7`}>
                <div className="flex items-center justify-between gap-3 mb-1">
                    <p className="font-serif font-bold text-xl text-fg">{title}</p>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-md p-1.5 text-muted hover:bg-surface hover:text-fg"
                    >
                        <CloseIcon width={20} height={20}/>
                    </button>
                </div>
                {subtitle && <p className="text-muted text-sm mb-5">{subtitle}</p>}
                {children}
            </div>
        </div>
    );
}