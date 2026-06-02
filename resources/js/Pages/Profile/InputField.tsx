// Reusable input field for profile forms.
// Shows Laravel validation errors directly below the field.

interface InputFieldProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    type?: string;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    id?: string;
    error?: string;
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
                               error,
                           }: InputFieldProps) {
    const fieldId = id ?? label.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    return (
        <div className="space-y-2">
            <label htmlFor={fieldId} className="text-sm font-semibold text-gray-600">
                {label}

                {required && (
                    <span className="ml-1 text-red-500" aria-hidden="true">
                        *
                    </span>
                )}
            </label>

            <input
                id={fieldId}
                type={type}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder={placeholder}
                required={required}
                disabled={disabled}
                aria-required={required}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? `${fieldId}-error` : undefined}
                className={`w-full rounded-xl border px-4 py-3 transition-colors focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400 ${
                    error
                        ? 'border-red-500 focus:ring-red-200'
                        : 'border-gray-200 focus:ring-[#5555ff]'
                }`}
            />

            {error && (
                <p id={`${fieldId}-error`} className="text-xs text-red-500">
                    {error}
                </p>
            )}
        </div>
    );
}
