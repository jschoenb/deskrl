import { Section } from './Section';
import { InputField } from './InputField';
import type { BusinessFormData } from '@/types/profile';

interface BusinessInformationSectionProps {
    business: BusinessFormData;
    businessErrors: Record<string, string>;
    updateBusiness: <K extends keyof BusinessFormData>(
        field: K,
        value: BusinessFormData[K],
    ) => void;
    onSave: () => void;
    onCancel: () => void;
}

export function BusinessInformationSection({
                                               business,
                                               businessErrors,
                                               updateBusiness,
                                               onSave,
                                               onCancel,
                                           }: BusinessInformationSectionProps) {
    return (
        <Section
            title="Unternehmensinformationen"
            onSave={onSave}
            onCancel={onCancel}
        >
            <div className="grid gap-4 md:grid-cols-2">
                <InputField
                    label="Firmenname"
                    value={business.companyName}
                    onChange={(value) => updateBusiness('companyName', value)}
                    error={businessErrors.company_name}
                    required
                />

                <InputField
                    label="Firmenbuchnummer"
                    value={business.companyRegistrationNumber}
                    onChange={(value) => updateBusiness('companyRegistrationNumber', value)}
                    placeholder="z. B. FN 123456a"
                    error={businessErrors.company_nr}
                    required
                />

                <InputField
                    label="UID-Nummer"
                    value={business.vatNumber}
                    onChange={(value) => updateBusiness('vatNumber', value)}
                    placeholder="z. B. ATU12345678"
                    error={businessErrors.vat_nr}
                    required
                />
            </div>
        </Section>
    );
}
