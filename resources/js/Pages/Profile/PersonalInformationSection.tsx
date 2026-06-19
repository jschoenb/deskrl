import { Section } from './Section';
import { InputField } from './InputField';
import { LanguageSelect } from './LanguageSelect';
import type { PersonalFormData } from '@/types/profile';
import { useIntl } from 'react-intl';

interface PersonalInformationSectionProps {
    personal: PersonalFormData;
    personalErrors: Record<string, string>;
    isCommercialHost: boolean;
    updatePersonal: <K extends keyof PersonalFormData>(
        field: K,
        value: PersonalFormData[K],
    ) => void;
    onSave: () => void;
    onCancel: () => void;
}

export function PersonalInformationSection({
                                               personal,
                                               personalErrors,
                                               isCommercialHost,
                                               updatePersonal,
                                               onSave,
                                               onCancel,
                                           }: PersonalInformationSectionProps) {
    const intl = useIntl();

    // Returns the translated text for the given translation key.
    const t = (id: string) => intl.formatMessage({ id });

    return (
        <Section
            title={isCommercialHost ? t('profile.personal.contactTitle') : t('profile.personal.title')}
            onSave={onSave}
            onCancel={onCancel}
        >
            <div className="grid gap-4 md:grid-cols-2">
                <InputField
                    label={t('profile.personal.firstName.label')}
                    value={personal.firstName}
                    onChange={(value) => updatePersonal('firstName', value)}
                    error={personalErrors.first_name}
                    required
                />

                <InputField
                    label={t('profile.personal.lastName.label')}
                    value={personal.lastName}
                    onChange={(value) => updatePersonal('lastName', value)}
                    error={personalErrors.last_name}
                    required
                />

                <InputField
                    label={t('profile.personal.email.label')}
                    type="email"
                    value={personal.email}
                    onChange={(value) => updatePersonal('email', value)}
                    error={personalErrors.email}
                    required
                />

                <InputField
                    label={t('profile.personal.birthdate.label')}
                    type="date"
                    value={personal.dateOfBirth}
                    onChange={(value) => updatePersonal('dateOfBirth', value)}
                    error={personalErrors.birthdate}
                />

                <InputField
                    label={t('profile.personal.phone.label')}
                    type="tel"
                    value={personal.phone}
                    onChange={(value) => updatePersonal('phone', value)}
                    placeholder={t('profile.personal.phone.placeholder')}
                    error={personalErrors.phone}
                />

                {!isCommercialHost && (
                    <>
                        <InputField
                            label={t('profile.personal.profession.label')}
                            value={personal.profession}
                            onChange={(value) => updatePersonal('profession', value)}
                            placeholder={t('profile.personal.profession.placeholder')}
                        />

                        <InputField
                            label={t('profile.personal.company.label')}
                            value={personal.company}
                            onChange={(value) => updatePersonal('company', value)}
                            placeholder={t('profile.personal.company.placeholder')}
                        />
                    </>
                )}
            </div>

            {!isCommercialHost && (
                <>
                    <LanguageSelect
                        selected={personal.languages}
                        onChange={(languages) => updatePersonal('languages', languages)}
                    />

                    {/* Personal description field */}
                    <div className="space-y-2">
                        <label htmlFor="about-me" className="text-sm font-semibold text-gray-600">
                            {t('profile.personal.aboutMe.label')}
                        </label>

                        <textarea
                            id="about-me"
                            value={personal.aboutMe}
                            onChange={(event) => updatePersonal('aboutMe', event.target.value)}
                            rows={4}
                            placeholder={t('profile.personal.aboutMe.placeholder')}
                            className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#5555ff]"
                        />

                        {personalErrors.about_me && (
                            <p className="text-xs text-red-500">
                                {personalErrors.about_me}
                            </p>
                        )}
                    </div>
                </>
            )}
        </Section>
    );
}
