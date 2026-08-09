import { useState } from "react";
import EyeOffIcon from "../Icons/EyeOffIcon";
import EyeOnIcon from "../Icons/EyeOnIcon";

type BaseProps = {
    label?: string;
    placeholder?: string;
    error?: string;
    rightSlot?: React.ReactNode;
};

type StringTextInputProps = BaseProps & {
    type?: "text" | "email" | "password";
    value: string;
    onChange: (value: string) => void;
};

type NumberTextInputProps = BaseProps & {
    type: "number";
    value: number | "";
    onChange: (value: number | "") => void;
};

type TextInputProps = StringTextInputProps | NumberTextInputProps;

export default function TextInput(props: TextInputProps) {
    const { label, placeholder, error, rightSlot, type = "text" } = props;
    const isPassword = type === "password";
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const handleChange = (raw: string) => {
        if (props.type === "number") {
            props.onChange(raw === "" ? "" : Number(raw));
        } else {
            props.onChange(raw);
        }
    };

    return (
        <div className="flex flex-col gap-1.5">
            {(label || rightSlot) && (
                <div className="flex items-baseline justify-between">
                    {label && <p className="text-sm font-medium text-fg">{label}</p>}
                    {rightSlot}
                </div>
            )}

            <div className="relative">
                <input
                    type={isPassword && showPassword ? "text" : type}
                    value={props.value}
                    onChange={(e) => handleChange(e.target.value)}
                    placeholder={placeholder}
                    className={`w-full h-11 rounded-lg border border-border px-3.5 text-base text-fg outline-none transition-colors placeholder:text-muted placeholder:text-sm focus:border-accent focus:ring-3 focus:ring-accent-bg 
                        ${isPassword ? "pr-11" : ""}
                        ${error ? "border-error focus:ring-error-bg" : "border-border"}
                    `}
                />

                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-1 top-1 flex h-9 w-9 items-center justify-center rounded-md hover:bg-surface hover:text-fg"
                    >
                        {showPassword ? <EyeOffIcon className="text-muted" width={19} height={19} /> : <EyeOnIcon className="text-muted" width={19} height={19} />}
                    </button>
                )}
            </div>

            {error && <span className="text-[12.5px] text-error">{error}</span>}
        </div>
    );
}