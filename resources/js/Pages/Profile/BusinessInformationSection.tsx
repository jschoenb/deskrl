import { Section } from './Section';
import { InputField } from './InputField';
import type { BusinessFormData } from '@/types/profile';
import { useIntl } from 'react-intl';

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
    const intl = useIntl();

    // Returns the translated text for the given translation key.
    const t = (id: string) => intl.formatMessage({ id });

    return (
        <Section
            title={t('profile.business.title')}
            onSave={onSave}
            onCancel={onCancel}
        >
            <div className="grid gap-4 md:grid-cols-2">
                <InputField
                    label={t('profile.business.companyName.label')}
                    value={business.companyName}
                    onChange={(value) => updateBusiness('companyName', value)}
                    error={businessErrors.company_name}
                    required
                />

                <InputField
                    label={t('profile.business.companyRegistrationNumber.label')}
                    value={business.companyRegistrationNumber}
                    onChange={(value) => updateBusiness('companyRegistrationNumber', value)}
                    placeholder={t('profile.business.companyRegistrationNumber.placeholder')}
                    error={businessErrors.company_nr}
                    required
                />

                <InputField
                    label={t('profile.business.vatNumber.label')}
                    value={business.vatNumber}
                    onChange={(value) => updateBusiness('vatNumber', value)}
                    placeholder={t('profile.business.vatNumber.placeholder')}
                    error={businessErrors.vat_nr}
                    required
                />
            </div>
        </Section>
    );
}
