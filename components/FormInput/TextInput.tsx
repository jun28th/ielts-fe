import { useState } from "react";
import EyeOffIcon from "../Icons/EyeOffIcon";
import EyeOnIcon from "../Icons/EyeOnIcon";

type TextInputProps = {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    type?: "text" | "email" | "password" | "number";
    error?: string;
    rightSlot?: React.ReactNode;
}

export default function TextInput({ label, value, onChange, placeholder, type = "text", error, rightSlot }: TextInputProps) {
    const isPassword = type === "password";
    const [showPassword, setShowPassword] = useState<boolean>(false);

    return (
        <div className="flex flex-col gap-1.5">
            <div className="flex items-baseline justify-between">
                <p className="text-sm font-medium text-fg">
                    {label}
                </p>
                {rightSlot}
            </div>

            <div className="relative">
                <input 
                    type={isPassword && showPassword ? "text" : type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className={`w-full h-11 rounded-lg border border-border px-3.5 text-base text-fg outline-none transition-colors placeholder:text-muted focus:border-accent focus:ring-3 focus:ring-accent-bg 
                        ${isPassword  ? "pr-11" : ""}
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