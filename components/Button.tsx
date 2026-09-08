import { Spin } from "antd";

type ButtonProps = {
    label: string;
    icon?: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    loading?: boolean;
    type?: "button" | "submit" | "reset";
    variant?: "primary" | "secondary" | "danger";
    fullWidth?: boolean;
    iconOnly?: boolean;
}

const VARIANT_STYLES: Record<NonNullable<ButtonProps["variant"]>, string> = {
    primary:
        "bg-accent text-white shadow-[0_2px_0_var(--color-accent-bg)] hover:bg-accent-hover active:translate-y-px active:bg-accent-active active:shadow-none disabled:bg-[#b7c4d6] disabled:shadow-none",
    secondary:
        "border border-border bg-bg text-fg hover:border-[#b9c2cf] hover:bg-surface",
    danger:
        "bg-error text-white hover:bg-[#ff7875] active:bg-[#d9363e]",
};

const ICON_ONLY_VARIANT_STYLES: Record<NonNullable<ButtonProps["variant"]>, string> = {
    primary:
        "bg-accent text-white hover:bg-accent-hover active:bg-accent-active disabled:bg-[#b7c4d6]",
    secondary:
        "border border-border bg-bg text-muted hover:border-accent hover:bg-accent-bg hover:text-accent",
    danger:
        "border border-border bg-bg text-muted hover:border-error hover:bg-error-bg hover:text-error",
};

export default function Button({ label, icon, onClick, disabled = false, loading = false, type = "button", variant = "primary", fullWidth = false, iconOnly = false }: ButtonProps) {
    const isDisabled = disabled || loading;

    if (iconOnly) {
        return (
            <button
                type={type}
                onClick={onClick}
                disabled={isDisabled}
                className={`inline-flex h-8 w-8 flex-none items-center justify-center rounded-lg transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${ICON_ONLY_VARIANT_STYLES[variant]}`}
            >
                {loading ? <Spin size="small" /> : icon}
            </button>
        );
    }

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={isDisabled}
            className={`inline-flex h-11 items-center justify-center gap-2.5 rounded-lg px-5 text-sm font-bold transition-colors cursor-pointer disabled:cursor-not-allowed ${fullWidth ? "w-full" : "w-fit"} ${VARIANT_STYLES[variant]}`}
        >
            {loading ? <Spin size="small"/> : icon}
            {label}
        </button>
    );
}