// ─── Pages/Profile/AddressFields.tsx ─────────────────────────────────────────
// Wiederverwendbares Adressformular – genutzt von AddressSection UND BillingSection.
// Vorher: Die ~60 Zeilen Adressfelder waren 2x nahezu identisch kopiert.

import { AddressFormData } from '../../types/profile';
import { CountrySelect } from './CountrySelect';
import { InputField } from './InputField';

interface AddressFieldsProps {
    data: AddressFormData;
    onChange: <K extends keyof AddressFormData>(field: K, value: string) => void;
    /** Präfix für IDs, um Konflikte bei doppelter Verwendung zu vermeiden */
    idPrefix?: string;
}

export function AddressFields({ data, onChange, idPrefix = '' }: AddressFieldsProps) {
    const prefix = idPrefix ? `${idPrefix}-` : '';

    return (
        <div className="space-y-4">
            <CountrySelect
                id={`${prefix}country`}
                value={data.country}
                onChange={(v) => onChange('country', v)}
            />

            <InputField
                id={`${prefix}street`}
                label="Straße + Hausnummer"
                value={data.street}
                onChange={(v) => onChange('street', v)}
                placeholder="z. B. Musterstraße 12"
            />

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <InputField
                    id={`${prefix}staircase`}
                    label="Stiege"
                    value={data.staircase}
                    onChange={(v) => onChange('staircase', v)}
                    placeholder="z. B. 1"
                />
                <InputField
                    id={`${prefix}apartment`}
                    label="Top"
                    value={data.apartment}
                    onChange={(v) => onChange('apartment', v)}
                    placeholder="z. B. 4"
                />
                <InputField
                    id={`${prefix}door`}
                    label="Tür"
                    value={data.door}
                    onChange={(v) => onChange('door', v)}
                    placeholder="z. B. A"
                />
                <InputField
                    id={`${prefix}postalCode`}
                    label="PLZ"
                    value={data.postalCode}
                    onChange={(v) => onChange('postalCode', v)}
                    placeholder="z. B. 1010"
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <InputField
                    id={`${prefix}city`}
                    label="Stadt"
                    value={data.city}
                    onChange={(v) => onChange('city', v)}
                    placeholder="z. B. Wien"
                />
                <InputField
                    id={`${prefix}state`}
                    label="Bundesland"
                    value={data.state}
                    onChange={(v) => onChange('state', v)}
                    placeholder="z. B. Wien"
                />
            </div>
        </div>
    );
}
