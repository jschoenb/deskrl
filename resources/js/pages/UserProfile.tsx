// resources/js/Pages/UserProfile.tsx
import { Head } from '@inertiajs/react';
import { useMemo, useState } from 'react';

// Komponenten importieren
import { Section } from './Profile/Section';
import { InputField } from './Profile/InputField';
import { ProfileHeader } from './Profile/ProfileHeader';
import { StatsGrid } from './Profile/StatsGrid';
import { VerificationSection } from './Profile/VerificationSection';
import { ProviderUpgrade } from './Profile/ProviderUpgrade';

type UserRole = 'user' | 'host' | 'admin';

interface UserFromBackend {
    id: number;
    name: string;
    email: string;
    role: UserRole;
    gender?: 'male' | 'female' | 'diverse' | 'undisclosed' | null;
    birthday?: string | null;
    profile_image?: string | null;
    job?: string | null;
    company?: string | null;
    about_me?: string | null;
    phone?: string | null;
    languages?: string | null;
    verification_status?: string | null;
}

interface UserProfileProps {
    user: UserFromBackend;
}

interface ProfileHeaderUser {
    name: string;
    email: string;
    profileImage: string | null;
    role: UserRole;
}

interface UpgradeUser {
    role: UserRole;
}

interface VerificationUser {
    role: UserRole;
    verificationStatus: string;
}

export default function UserProfile({ user }: UserProfileProps) {
    const splitName = useMemo(() => {
        const parts = user.name?.trim().split(/\s+/) ?? [];
        return {
            firstName: parts[0] ?? '',
            lastName: parts.slice(1).join(' ') ?? '',
        };
    }, [user.name]);

    const initialFormData = useMemo(
        () => ({
            firstName: splitName.firstName,
            lastName: splitName.lastName,
            email: user.email ?? '',
            gender: user.gender ?? '',
            dateOfBirth: user.birthday ?? '',
            phone: user.phone ?? '',
            languages: user.languages ?? '',
            profession: user.job ?? '',
            company: user.company ?? '',
            aboutMe: user.about_me ?? '',
        }),
        [splitName.firstName, splitName.lastName, user]
    );

    console.log(user);

    const [formData, setFormData] = useState(initialFormData);

    const currentUserForHeader: ProfileHeaderUser = {
        name: user.name,
        email: user.email,
        profileImage: user.profile_image ?? null,
        role: user.role,
    };

    const currentUserForUpgrade: UpgradeUser = {
        role: user.role,
    };

    const currentUserForVerification: VerificationUser = {
        role: user.role,
        verificationStatus: user.verification_status ?? 'unverified',
    };

    const handleInputChange = (field: keyof typeof formData, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSavePersonalInfo = () => {
        console.log('Gespeichert:', formData);
        alert('Änderungen gespeichert!');
    };

    const handleCancel = () => {
        setFormData(initialFormData);
    };

    return (
        <div>
            <Head title="Mein Profil" />

            <div className="min-h-screen bg-gray-50">
                <div className="mx-auto max-w-4xl px-4 py-12">
                    <ProfileHeader user={currentUserForHeader} />

                    <StatsGrid />

                    <ProviderUpgrade user={currentUserForUpgrade} />

                    <Section
                        title="Persönliche Informationen"
                        onSave={handleSavePersonalInfo}
                        onCancel={handleCancel}
                    >
                        <div className="grid gap-4 md:grid-cols-2">
                            <InputField
                                label="Vorname"
                                value={formData.firstName}
                                onChange={(value) => handleInputChange('firstName', value)}
                            />

                            <InputField
                                label="Nachname"
                                value={formData.lastName}
                                onChange={(value) => handleInputChange('lastName', value)}
                            />

                            <InputField
                                label="E-Mail"
                                value={formData.email}
                                onChange={(value) => handleInputChange('email', value)}
                                type="email"
                            />

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-600">
                                    Geschlecht
                                </label>
                                <select
                                    value={formData.gender}
                                    onChange={(e) => handleInputChange('gender', e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#5555ff]"
                                >
                                    <option value="">Bitte wählen</option>
                                    <option value="male">Männlich</option>
                                    <option value="female">Weiblich</option>
                                    <option value="diverse">Divers</option>
                                    <option value="undisclosed">Keine Angabe</option>
                                </select>
                            </div>

                            <InputField
                                label="Geburtsdatum"
                                value={formData.dateOfBirth}
                                onChange={(value) => handleInputChange('dateOfBirth', value)}
                                type="date"
                            />

                            <InputField
                                label="Telefon"
                                value={formData.phone}
                                onChange={(value) => handleInputChange('phone', value)}
                                type="tel"
                            />

                            <InputField
                                label="Sprachen"
                                value={formData.languages}
                                onChange={(value) => handleInputChange('languages', value)}
                            />

                            <InputField
                                label="Beruf"
                                value={formData.profession}
                                onChange={(value) => handleInputChange('profession', value)}
                            />

                            <InputField
                                label="Firma"
                                value={formData.company}
                                onChange={(value) => handleInputChange('company', value)}
                            />
                        </div>

                        <div className="mt-4 space-y-2">
                            <label className="text-sm font-semibold text-gray-600">
                                Über mich
                            </label>
                            <textarea
                                value={formData.aboutMe}
                                onChange={(e) => handleInputChange('aboutMe', e.target.value)}
                                rows={4}
                                className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#5555ff]"
                            />
                        </div>
                    </Section>

                    <VerificationSection user={currentUserForVerification} />
                </div>
            </div>
        </div>
    );
}
