// Reusable country select for profile address forms.
// The component is used for both the main address and the billing address.

import { useIntl } from 'react-intl';

interface CountrySelectProps {
    value: string;
    onChange: (value: string) => void;
    label?: string;
    id?: string;
}

// Static MVP country list.
// TODO: Replace this list with countries from the backend when country management is connected.
const COUNTRIES = [
    { code: 'AT', labelKey: 'country.AT' },
    { code: 'DE', labelKey: 'country.DE' },
    { code: 'CH', labelKey: 'country.CH' },
    { code: 'IT', labelKey: 'country.IT' },
    { code: 'FR', labelKey: 'country.FR' },
    { code: 'NL', labelKey: 'country.NL' },
    { code: 'BE', labelKey: 'country.BE' },
    { code: 'CZ', labelKey: 'country.CZ' },
    { code: 'PL', labelKey: 'country.PL' },
    { code: 'HU', labelKey: 'country.HU' },
] as const;

export function CountrySelect({
                                  value,
                                  onChange,
                                  label,
                                  id = 'country',
                              }: CountrySelectProps) {
    const intl = useIntl();

    // Returns the translated text for the given translation key.
    const t = (id: string) => intl.formatMessage({ id });

    return (
        <div className="space-y-2">
            <label htmlFor={id} className="text-sm font-semibold text-gray-600">
                {label ?? t('address.country.label')}
            </label>

            {/* Country selection used by address-related forms. */}
            <select
                id={id}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#5555ff]"
            >
                <option value="">
                    {t('address.country.placeholder')}
                </option>

                {COUNTRIES.map(({ code, labelKey }) => (
                    <option key={code} value={code}>
                        {t(labelKey)}
                    </option>
                ))}
            </select>
        </div>
    );
}
