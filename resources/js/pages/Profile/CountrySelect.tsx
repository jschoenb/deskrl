// ─── Pages/Profile/CountrySelect.tsx ─────────────────────────────────────────
// Ausgelagert weil identisch in Address UND Billing verwendet.
// Vorher: Dieselbe <select>-Liste 2x kopiert → jetzt 1x definiert.

interface CountrySelectProps {
    value: string;
    onChange: (value: string) => void;
    label?: string;
    id?: string;
}

// Erweiterbar: könnte auch aus einer API kommen
const COUNTRIES = [
    { code: 'AT', label: 'Österreich' },
    { code: 'DE', label: 'Deutschland' },
    { code: 'CH', label: 'Schweiz' },
    { code: 'IT', label: 'Italien' },
    { code: 'FR', label: 'Frankreich' },
    { code: 'NL', label: 'Niederlande' },
    { code: 'BE', label: 'Belgien' },
    { code: 'CZ', label: 'Tschechien' },
    { code: 'PL', label: 'Polen' },
    { code: 'HU', label: 'Ungarn' },
] as const;

export function CountrySelect({ value, onChange, label = 'Land', id = 'country' }: CountrySelectProps) {
    return (
        <div className="space-y-2">
            <label htmlFor={id} className="text-sm font-semibold text-gray-600">
                {label}
            </label>
            <select
                id={id}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-3
                           focus:outline-none focus:ring-2 focus:ring-[#5555ff]"
            >
                <option value="">Land auswählen</option>
                {COUNTRIES.map(({ code, label: countryLabel }) => (
                    <option key={code} value={code}>
                        {countryLabel}
                    </option>
                ))}
            </select>
        </div>
    );
}
