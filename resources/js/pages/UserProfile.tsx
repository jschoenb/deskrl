import AppLayout from '@/Layouts/AppLayout';
import { InertiaPage } from '@/types/inertia';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import type { ReactNode } from 'react';

import { useProfileForm } from '@/hooks/useProfileForm';
import { ProfileHeader } from './Profile/ProfileHeader';
import { StatsGrid } from './Profile/StatsGrid';
import { ProviderUpgrade } from './Profile/ProviderUpgrade';
import { VerificationSection } from './Profile/VerificationSection';
import { Section } from './Profile/Section';
import { InputField } from './Profile/InputField';
import { LanguageSelect } from './Profile/LanguageSelect';
import { AddressFields } from './Profile/AddressFields';
import { CommercialVerificationModal } from './Profile/CommercialVerificationModal';

import type { UserFromBackend, VerificationStatus } from '@/types/profile';

interface UserProfileProps {
    account: UserFromBackend;
    stats?: {
        totalBookings: number;
        visitedPlaces: number;
        favorites: number;
    };
}

const UserProfile: InertiaPage<UserProfileProps> = ({ account, stats }) => {
    const [showCommercialVerificationModal, setShowCommercialVerificationModal] = useState(false);

    const {
        personal,
        address,
        billing,
        business,
        isBillingSameAsAddress,
        addressErrors,
        billingErrors,
        updatePersonal,
        updateAddress,
        updateBilling,
        updateBusiness,
        setIsBillingSameAsAddress,
        handleSavePersonal,
        handleCancelPersonal,
        handleSaveAddress,
        handleCancelAddress,
        handleSaveBilling,
        handleCancelBilling,
        handleSaveBusiness,
        handleCancelBusiness,
    } = useProfileForm(account);

    // Read the current account type from the backend.
    const role = account.account_type ?? 'user';

    // Detect whether the logged-in account is a provider account.
    const isHost = role === 'private_host' || role === 'commercial_host';

    // Detect whether the logged-in account is a commercial provider account.
    const isCommercialHost = role === 'commercial_host';

    // Use email verification for now until a dedicated provider verification status exists.
    const verificationStatus: VerificationStatus = account.email_verified ? 'verified' : 'unverified';

    return (
        <>
            <Head title="Mein Profil" />

            <div className="min-h-screen bg-gray-50">
                <div className="mx-auto max-w-4xl px-4 py-12">
                    <ProfileHeader
                        user={{
                            first_name: account.first_name ?? '',
                            last_name: account.last_name ?? '',
                            email: account.email ?? '',
                            profileImage: account.profile_image ?? null,
                            role,
                            verificationStatus,
                        }}
                    />

                    {/* Show user statistics only for regular users. */}
                    {!isHost && (
                        <StatsGrid role={role} stats={stats} />
                    )}

                    {/* Show the provider upgrade box only for regular users. */}
                    {!isHost && (
                        <ProviderUpgrade
                            role={role}
                            onUpgradeClick={() => setShowCommercialVerificationModal(true)}
                        />
                    )}

                    {/* Show the MVP verification notice for provider accounts. */}
                    {isHost && (
                        <VerificationSection
                            user={{
                                role,
                                verificationStatus,
                            }}
                        />
                    )}

                    <Section
                        title={isCommercialHost ? 'Kontaktperson' : 'Persönliche Informationen'}
                        onSave={handleSavePersonal}
                        onCancel={handleCancelPersonal}
                    >
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

                        {/* Hide public profile fields for commercial providers. */}
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

                    {/* Show company data only for commercial providers. */}
                    {isCommercialHost && (
                        <Section
                            title="Unternehmensinformationen"
                            onSave={handleSaveBusiness}
                            onCancel={handleCancelBusiness}
                        >
                            <div className="grid gap-4 md:grid-cols-2">
                                <InputField
                                    label="Firmenname"
                                    value={business.companyName}
                                    onChange={(value) => updateBusiness('companyName', value)}
                                    required
                                />

                                <InputField
                                    label="Firmenbuchnummer"
                                    value={business.companyRegistrationNumber}
                                    onChange={(value) => updateBusiness('companyRegistrationNumber', value)}
                                    placeholder="z. B. FN 123456a"
                                />

                                <InputField
                                    label="UID-Nummer"
                                    value={business.vatNumber}
                                    onChange={(value) => updateBusiness('vatNumber', value)}
                                    placeholder="z. B. ATU12345678"
                                />
                            </div>
                        </Section>
                    )}

                    <Section
                        title={isHost ? 'Anbieter-Adresse' : 'Adresse'}
                        onSave={handleSaveAddress}
                        onCancel={handleCancelAddress}
                    >
                        <AddressFields
                            data={address}
                            onChange={updateAddress}
                            idPrefix="address"
                            errors={addressErrors}
                        />

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

                    {!isBillingSameAsAddress && (
                        <Section
                            title="Rechnungsadresse"
                            onSave={handleSaveBilling}
                            onCancel={handleCancelBilling}
                        >
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

                            <AddressFields
                                data={billing}
                                onChange={(field, value) => updateBilling(field, value)}
                                idPrefix="billing"
                                errors={billingErrors}
                            />
                        </Section>
                    )}
                </div>
            </div>

            <CommercialVerificationModal
                isOpen={showCommercialVerificationModal}
                onClose={() => setShowCommercialVerificationModal(false)}
            />
        </>
    );
};

UserProfile.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>;

export default UserProfile;
