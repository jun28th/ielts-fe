type ButtonProps = {
    label: string;
    icon?: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    type?: "button" | "submit" | "reset";
    variant?: "primary" | "secondary" | "danger";
    fullWidth?: boolean;
}

const VARIANT_STYLES: Record<NonNullable<ButtonProps["variant"]>, string> = {
    primary:
        "bg-accent text-white shadow-[0_2px_0_var(--color-accent-bg)] hover:bg-accent-hover active:translate-y-px active:bg-accent-active active:shadow-none disabled:bg-[#b7c4d6] disabled:shadow-none",
    secondary:
        "border border-border bg-bg text-fg hover:border-[#b9c2cf] hover:bg-surface",
    danger:
        "bg-error text-white hover:bg-[#ff7875] active:bg-[#d9363e]",
};

export default function Button({ label, icon, onClick, disabled = false, type = "button", variant = "primary", fullWidth = false }: ButtonProps) {

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`inline-flex h-11 items-center justify-center gap-2.5 rounded-lg px-5 text-sm font-bold transition-colors cursor-pointer disabled:cursor-not-allowed ${fullWidth ? "w-full" : "w-fit"} ${VARIANT_STYLES[variant]}`}
        >
            {icon}
            {label}
        </button>
    );
}