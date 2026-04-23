
// resources/js/Pages/Profile/components/InputField.tsx
interface InputFieldProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    type?: string;
    placeholder?: string;
}

export function InputField({ label, value, onChange, type = 'text', placeholder }: InputFieldProps) {
    return (
        <div className="space-y-2">
            <label className="text-sm text-gray-600 font-semibold">{label}</label>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5555ff]"
            />
        </div>
    );
}
