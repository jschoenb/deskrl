// Reusable country select for profile address forms.
// The component is used for both the main address and the billing address.

interface CountrySelectProps {
    value: string;
    onChange: (value: string) => void;
    label?: string;
    id?: string;
}

// Static MVP country list.
// TODO: Replace this list with countries from the backend when country management is connected.
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

export function CountrySelect({
                                  value,
                                  onChange,
                                  label = 'Land',
                                  id = 'country',
                              }: CountrySelectProps) {
    return (
        <div className="space-y-2">
            <label htmlFor={id} className="text-sm font-semibold text-gray-600">
                {label}
            </label>

            {/* Country selection used by address-related forms */}
            <select
                id={id}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#5555ff]"
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
