// Reusable address form for the main address and billing address.
// The component only edits address fields, but it can receive extended form data like BillingFormData.

import { AddressFormData, BillingFormData } from '@/types/profile';
import { CountrySelect } from './CountrySelect';
import { InputField } from './InputField';

type AddressFieldKey = keyof AddressFormData;

interface AddressFieldsProps {
    data: AddressFormData | BillingFormData;
    onChange: (field: AddressFieldKey, value: string | number | null) => void;
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

    // Updates one address field and keeps the typing simple for both address and billing forms.
    const handleChange = (field: AddressFieldKey, value: string | number | null) => {
        onChange(field, value);
    };

    // Sets the visible country text and a temporary default country ID.
    // Later this should be replaced by a real country dropdown using database IDs.
    const handleCountryChange = (value: string) => {
        handleChange('country', value);

        if (value && !data.countryId) {
            handleChange('countryId', 1);
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
                        onChange={(value) => handleChange('street', value)}
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
                        onChange={(value) => handleChange('houseNumber', value)}
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
                        onChange={(value) => handleChange('staircase', value)}
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
                        onChange={(value) => handleChange('apartment', value)}
                        placeholder="z. B. 4"
                    />
                </div>

                <div>
                    <InputField
                        id={`${prefix}door`}
                        label="Tür / Top (optional)"
                        value={data.door}
                        onChange={(value) => handleChange('door', value)}
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
                        onChange={(value) => handleChange('postalCode', value)}
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
                        onChange={(value) => handleChange('city', value)}
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
                        onChange={(value) => handleChange('state', value)}
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
