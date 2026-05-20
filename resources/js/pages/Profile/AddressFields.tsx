// resources/js/pages/Profile/AddressFields.tsx

// Reusable address form for the main address and billing address.
// The component is adapted to the current database schema:
// addresses.country_id, street, house_nr, postal_code, city, state, stair, door.

import { AddressFormData, BillingFormData } from '../../types/profile';
import { CountrySelect } from './CountrySelect';
import { InputField } from './InputField';

interface AddressFieldsProps {
    data: AddressFormData | BillingFormData;
    onChange: <K extends keyof (AddressFormData | BillingFormData)>(
        field: K,
        value: (AddressFormData | BillingFormData)[K]
    ) => void;
    idPrefix?: string;
    errors?: Record<string, string>;
}

export function AddressFields({
                                  data,
                                  onChange,
                                  idPrefix = '',
                                  errors = {},
                              }: AddressFieldsProps) {
    const prefix = idPrefix ? `${idPrefix}-` : '';

    // Set country name and a default country_id for Austria.
    // Later this should be replaced by a real country dropdown with IDs.
    const handleCountryChange = (value: string) => {
        onChange('country', value);

        if (value && !data.countryId) {
            onChange('countryId', 1);
        }
    };

    return (
        <div className="space-y-4">
            {/* Country */}
            <div>
                <CountrySelect
                    id={`${prefix}country`}
                    value={data.country}
                    onChange={handleCountryChange}
                />

                <p className="mt-1 text-xs text-gray-400">
                    Pflichtfeld
                </p>

                {errors.country_id && (
                    <p className="mt-1 text-xs text-red-500">
                        {errors.country_id}
                    </p>
                )}
            </div>

            {/* Street and house number */}
            <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
                <div>
                    <InputField
                        id={`${prefix}street`}
                        label="Straße *"
                        value={data.street}
                        onChange={(value) => onChange('street', value)}
                        placeholder="z. B. Musterstraße"
                    />

                    {errors.street && (
                        <p className="mt-1 text-xs text-red-500">
                            {errors.street}
                        </p>
                    )}
                </div>

                <div>
                    <InputField
                        id={`${prefix}houseNumber`}
                        label="Hausnummer *"
                        value={data.houseNumber}
                        onChange={(value) => onChange('houseNumber', value)}
                        placeholder="z. B. 12"
                    />

                    {errors.house_nr && (
                        <p className="mt-1 text-xs text-red-500">
                            {errors.house_nr}
                        </p>
                    )}
                </div>
            </div>

            {/* Optional address details and postal code */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div>
                    <InputField
                        id={`${prefix}staircase`}
                        label="Stiege (optional)"
                        value={data.staircase}
                        onChange={(value) => onChange('staircase', value)}
                        placeholder="z. B. 1"
                    />

                    {errors.stair && (
                        <p className="mt-1 text-xs text-red-500">
                            {errors.stair}
                        </p>
                    )}
                </div>

                <div>
                    <InputField
                        id={`${prefix}apartment`}
                        label="Top (optional)"
                        value={data.apartment}
                        onChange={(value) => onChange('apartment', value)}
                        placeholder="z. B. 4"
                    />
                </div>

                <div>
                    <InputField
                        id={`${prefix}door`}
                        label="Tür (optional)"
                        value={data.door}
                        onChange={(value) => onChange('door', value)}
                        placeholder="z. B. A"
                    />

                    {errors.door && (
                        <p className="mt-1 text-xs text-red-500">
                            {errors.door}
                        </p>
                    )}
                </div>

                <div>
                    <InputField
                        id={`${prefix}postalCode`}
                        label="PLZ *"
                        value={data.postalCode}
                        onChange={(value) => onChange('postalCode', value)}
                        placeholder="z. B. 1010"
                    />

                    {errors.postal_code && (
                        <p className="mt-1 text-xs text-red-500">
                            {errors.postal_code}
                        </p>
                    )}
                </div>
            </div>

            {/* City and state */}
            <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <InputField
                        id={`${prefix}city`}
                        label="Stadt *"
                        value={data.city}
                        onChange={(value) => onChange('city', value)}
                        placeholder="z. B. Wien"
                    />

                    {errors.city && (
                        <p className="mt-1 text-xs text-red-500">
                            {errors.city}
                        </p>
                    )}
                </div>

                <div>
                    <InputField
                        id={`${prefix}state`}
                        label="Bundesland (optional)"
                        value={data.state}
                        onChange={(value) => onChange('state', value)}
                        placeholder="z. B. Wien"
                    />

                    {errors.state && (
                        <p className="mt-1 text-xs text-red-500">
                            {errors.state}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
