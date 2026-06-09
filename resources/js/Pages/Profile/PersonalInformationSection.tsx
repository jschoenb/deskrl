import { Section } from './Section';
import { InputField } from './InputField';
import { LanguageSelect } from './LanguageSelect';
import type { PersonalFormData } from '@/types/profile';

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
    return (
        <Section
            title={isCommercialHost ? 'Kontaktperson' : 'Persönliche Informationen'}
            onSave={onSave}
            onCancel={onCancel}
        >
            <div className="grid gap-4 md:grid-cols-2">
                <InputField
                    label="Vorname"
                    value={personal.firstName}
                    onChange={(value) => updatePersonal('firstName', value)}
                    error={personalErrors.first_name}
                    required
                />

                <InputField
                    label="Nachname"
                    value={personal.lastName}
                    onChange={(value) => updatePersonal('lastName', value)}
                    error={personalErrors.last_name}
                    required
                />

                <InputField
                    label="E-Mail"
                    type="email"
                    value={personal.email}
                    onChange={(value) => updatePersonal('email', value)}
                    error={personalErrors.email}
                    required
                />

                <InputField
                    label="Geburtsdatum"
                    type="date"
                    value={personal.dateOfBirth}
                    onChange={(value) => updatePersonal('dateOfBirth', value)}
                    error={personalErrors.birthdate}
                />

                <InputField
                    label="Telefon"
                    type="tel"
                    value={personal.phone}
                    onChange={(value) => updatePersonal('phone', value)}
                    placeholder="+43 699 12345678"
                    error={personalErrors.phone}
                />

                {!isCommercialHost && (
                    <>
                        <InputField
                            label="Beruf"
                            value={personal.profession}
                            onChange={(value) => updatePersonal('profession', value)}
                            placeholder="z. B. Software-Entwickler:in"
                        />

                        <InputField
                            label="Firma"
                            value={personal.company}
                            onChange={(value) => updatePersonal('company', value)}
                            placeholder="z. B. Muster GmbH"
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

                    <div className="space-y-2">
                        <label htmlFor="about-me" className="text-sm font-semibold text-gray-600">
                            Über mich
                        </label>

                        <textarea
                            id="about-me"
                            value={personal.aboutMe}
                            onChange={(event) => updatePersonal('aboutMe', event.target.value)}
                            rows={4}
                            placeholder="Erzähl anderen, wer du bist…"
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
