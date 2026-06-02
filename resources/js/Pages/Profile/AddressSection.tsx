import { Section } from './Section';
import { AddressFields } from './AddressFields';
import { InputField } from './InputField';
import type { AddressFormData, BillingFormData } from '@/types/profile';

interface AddressSectionProps {
    address: AddressFormData;
    billing: BillingFormData;
    isHost: boolean;
    isBillingSameAsAddress: boolean;
    addressErrors: Record<string, string>;
    billingErrors: Record<string, string>;
    updateAddress: <K extends keyof AddressFormData>(
        field: K,
        value: AddressFormData[K],
    ) => void;
    updateBilling: <K extends keyof BillingFormData>(
        field: K,
        value: BillingFormData[K],
    ) => void;
    setIsBillingSameAsAddress: (value: boolean) => void;
    onSaveAddress: () => void;
    onCancelAddress: () => void;
    onSaveBilling: () => void;
    onCancelBilling: () => void;
}

export function AddressSection({
                                   address,
                                   billing,
                                   isHost,
                                   isBillingSameAsAddress,
                                   addressErrors,
                                   billingErrors,
                                   updateAddress,
                                   updateBilling,
                                   setIsBillingSameAsAddress,
                                   onSaveAddress,
                                   onCancelAddress,
                                   onSaveBilling,
                                   onCancelBilling,
                               }: AddressSectionProps) {
    return (
        <>
            <Section
                title={isHost ? 'Anbieter-Adresse' : 'Adresse'}
                onSave={onSaveAddress}
                onCancel={onCancelAddress}
            >
                {/* Main address fields are handled by the reusable AddressFields component. */}
                <AddressFields
                    data={address}
                    onChange={updateAddress}
                    idPrefix="address"
                    errors={addressErrors}
                />

                {/* Billing address toggle belongs to the main address area. */}
                <div className="border-t border-gray-200 pt-6">
                    <h3 className="mb-4 text-base font-bold">
                        Ist die Rechnungsadresse dieselbe?
                    </h3>

                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => setIsBillingSameAsAddress(true)}
                            aria-pressed={isBillingSameAsAddress}
                            className={`flex-1 rounded-xl border-2 px-6 py-3 font-semibold transition-all ${
                                isBillingSameAsAddress
                                    ? 'border-[#5555ff] bg-[#f5f5ff] text-[#5555ff]'
                                    : 'border-gray-200 text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Ja
                        </button>

                        <button
                            type="button"
                            onClick={() => setIsBillingSameAsAddress(false)}
                            aria-pressed={!isBillingSameAsAddress}
                            className={`flex-1 rounded-xl border-2 px-6 py-3 font-semibold transition-all ${
                                !isBillingSameAsAddress
                                    ? 'border-[#5555ff] bg-[#f5f5ff] text-[#5555ff]'
                                    : 'border-gray-200 text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Nein
                        </button>
                    </div>
                </div>
            </Section>

            {/* Billing address fields are shown only when they differ from the main address. */}
            {!isBillingSameAsAddress && (
                <Section
                    title="Rechnungsadresse"
                    onSave={onSaveBilling}
                    onCancel={onCancelBilling}
                >
                    {/* Billing-specific company fields */}
                    <div className="grid gap-4 md:grid-cols-2">
                        <InputField
                            label="Firma (optional)"
                            value={billing.billingCompany}
                            onChange={(value) => updateBilling('billingCompany', value)}
                        />

                        <InputField
                            label="UID-Nummer (optional)"
                            value={billing.billingVatNumber}
                            onChange={(value) => updateBilling('billingVatNumber', value)}
                            placeholder="ATU12345678"
                        />
                    </div>

                    {/* Reusable address fields for the billing address */}
                    <AddressFields
                        data={billing}
                        onChange={(field, value) => updateBilling(field, value)}
                        idPrefix="billing"
                        errors={billingErrors}
                    />
                </Section>
            )}
        </>
    );
}
