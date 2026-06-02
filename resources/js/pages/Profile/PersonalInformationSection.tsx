import { Section } from './Section';
import { InputField } from './InputField';
import { LanguageSelect } from './LanguageSelect';
import type { PersonalFormData } from '@/types/profile';

interface PersonalInformationSectionProps {
    personal: PersonalFormData;
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
            {/* Basic personal fields */}
            <div className="grid gap-4 md:grid-cols-2">
                <InputField
                    label="Vorname"
                    value={personal.firstName}
                    onChange={(value) => updatePersonal('firstName', value)}
                    required
                />

                <InputField
                    label="Nachname"
                    value={personal.lastName}
                    onChange={(value) => updatePersonal('lastName', value)}
                    required
                />

                <InputField
                    label="E-Mail"
                    type="email"
                    value={personal.email}
                    onChange={(value) => updatePersonal('email', value)}
                    required
                />

                <InputField
                    label="Geburtsdatum"
                    type="date"
                    value={personal.dateOfBirth}
                    onChange={(value) => updatePersonal('dateOfBirth', value)}
                />

                <InputField
                    label="Telefon"
                    type="tel"
                    value={personal.phone}
                    onChange={(value) => updatePersonal('phone', value)}
                    placeholder="+43 699 12345678"
                />

                {/* Regular users and private hosts can maintain public profile details. */}
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

            {/* Public profile fields are hidden for commercial hosts. */}
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
                    </div>
                </>
            )}
        </Section>
    );
}
