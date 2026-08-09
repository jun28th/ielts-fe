type DatePickerProps = {
    label?: string;
    value: string; // "YYYY-MM-DD" or ""
    onChange: (value: string) => void;
    placeholder?: string;
    error?: string;
};

export default function DatePicker({ label, value, onChange, placeholder, error }: DatePickerProps) {


    return (
        <div className="flex flex-col gap-1.5">
            {label && <p className="text-sm font-medium text-fg">{label}</p>}

            <input
                type="date"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className={`w-full h-11 rounded-lg border border-border px-3.5 text-base text-fg outline-none transition-colors placeholder:text-muted placeholder:text-sm focus:border-accent focus:ring-3 focus:ring-accent-bg
                    ${error ? "border-error focus:ring-error-bg" : "border-border"}
                `}
            />

            {error && <span className="text-[12.5px] text-error">{error}</span>}
        </div>
    );
}