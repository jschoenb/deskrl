// ─── Pages/Profile/InputField.tsx ────────────────────────────────────────────
// Kleine Verbesserungen gegenüber deiner Version:
// - htmlFor + id für Barrierefreiheit (Screen Reader, Klick auf Label)
// - aria-required für Pflichtfelder
// - disabled-State

interface InputFieldProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    type?: string;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    id?: string;
}

export function InputField({
                               label,
                               value,
                               onChange,
                               type = 'text',
                               placeholder,
                               required = false,
                               disabled = false,
                               id,
                           }: InputFieldProps) {
    // Fallback-ID aus Label ableiten wenn nicht angegeben
    const fieldId = id ?? label.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    return (
        <div className="space-y-2">
            <label htmlFor={fieldId} className="text-sm font-semibold text-gray-600">
                {label}
                {required && <span className="ml-1 text-red-500" aria-hidden="true">*</span>}
            </label>
            <input
                id={fieldId}
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                required={required}
                disabled={disabled}
                aria-required={required}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 transition-colors
                           focus:outline-none focus:ring-2 focus:ring-[#5555ff]
                           disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400"
            />
        </div>
    );
}
