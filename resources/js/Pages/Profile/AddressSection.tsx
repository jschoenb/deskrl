import { Section } from './Section';
import { AddressFields } from './AddressFields';
import { InputField } from './InputField';
import type { AddressFormData, BillingFormData } from '@/types/profile';
import { useIntl } from 'react-intl';

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
    const intl = useIntl();

    // Returns the translated text for the given translation key.
    const t = (id: string) => intl.formatMessage({ id });

    return (
        <>
            <Section
                title={isHost ? t('profile.address.providerTitle') : t('profile.address.title')}
                onSave={onSaveAddress}
                onCancel={onCancelAddress}
            >
                {/* Main address fields are handled by the reusable AddressFields component. */}
                <AddressFields
                    data={address}
                    onChange={(field, value) => updateAddress(field, value as any)}
                    idPrefix="address"
                    errors={addressErrors}
                />

                {/* Billing address toggle belongs to the main address area. */}
                <div className="border-t border-gray-200 pt-6">
                    <h3 className="mb-4 text-base font-bold">
                        {t('profile.billing.sameAsAddressQuestion')}
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
                            {t('common.yes')}
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
                            {t('common.no')}
                        </button>
                    </div>
                </div>
            </Section>

            {/* Billing address fields are shown only when they differ from the main address. */}
            {!isBillingSameAsAddress && (
                <Section
                    title={t('profile.billing.title')}
                    onSave={onSaveBilling}
                    onCancel={onCancelBilling}
                >
                    {/* Billing-specific company fields */}
                    <div className="grid gap-4 md:grid-cols-2">
                        <InputField
                            label={t('profile.billing.company.label')}
                            value={billing.billingCompany}
                            onChange={(value) => updateBilling('billingCompany', value)}
                            error={billingErrors.company_name}
                        />

                        <InputField
                            label={t('profile.billing.vatNumber.label')}
                            value={billing.billingVatNumber}
                            onChange={(value) => updateBilling('billingVatNumber', value)}
                            placeholder={t('profile.billing.vatNumber.placeholder')}
                            error={billingErrors.vat_nr}
                        />
                    </div>

                    {/* Reusable address fields for the billing address */}
                    <AddressFields
                        data={billing}
                        onChange={(field, value) => updateBilling(field, value as any)}
                        idPrefix="billing"
                        errors={billingErrors}
                    />
                </Section>
            )}
        </>
    );
}
