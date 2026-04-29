// ─── Pages/UserProfile.tsx ───────────────────────────────────────────────────
// Die Page selbst ist jetzt schlank: Nur Komposition von Sub-Komponenten.
// Sämtliche Formular-Logik steckt im useProfileForm-Hook.
// Vergleich: Vorher ~700 Zeilen | Nachher ~150 Zeilen

import { Head } from '@inertiajs/react';
import { useProfileForm } from '../hooks/useProfileForm';
import { ProfileHeader } from './Profile/ProfileHeader';
import { StatsGrid } from './Profile/StatsGrid';
import { ProviderUpgrade } from './Profile/ProviderUpgrade';
import { VerificationSection } from './Profile/VerificationSection';
import { Section } from './Profile/Section';
import { InputField } from './Profile/InputField';
import { LanguageSelect } from './Profile/LanguageSelect';
import { AddressFields } from './Profile/AddressFields';
import { CountrySelect } from './Profile/CountrySelect';
import type { UserFromBackend, VerificationStatus } from '../types/profile';

interface UserProfileProps {
    user: UserFromBackend;
    stats?: {
        totalBookings: number;
        visitedPlaces: number;
        favorites: number;
    };
}

export default function UserProfile({ user, stats }: UserProfileProps) {
    const {
        personal, address, billing, business,
        isBillingSameAsAddress,
        updatePersonal, updateAddress, updateBilling, updateBusiness,
        setIsBillingSameAsAddress,
        handleSavePersonal, handleCancelPersonal,
        handleSaveAddress, handleCancelAddress,
        handleSaveBilling, handleCancelBilling,
        handleSaveBusiness, handleCancelBusiness,
    } = useProfileForm(user);

    const isHost = user.role === 'host';
    const isBusinessHost = isHost; // Erweiterbar wenn providerType dazukommt

    return (
        <>
            <Head title="Mein Profil" />

            <div className="min-h-screen bg-gray-50">
                <div className="mx-auto max-w-4xl px-4 py-12">

                    <ProfileHeader
                        user={{
                            name: user.name,
                            email: user.email,
                            profileImage: user.profile_image ?? null,
                            role: user.role,
                            verificationStatus: (user.verification_status as VerificationStatus) ?? 'unverified',
                        }}
                    />

                    <StatsGrid role={user.role} stats={stats} />

                    <ProviderUpgrade role={user.role} />

                    <VerificationSection
                        user={{
                            role: user.role,
                            verificationStatus: (user.verification_status as VerificationStatus) ?? 'unverified',
                        }}
                    />

                    {/* ─── Persönliche Informationen (nur für nicht-Business-Hosts) ─── */}
                    {!isBusinessHost && (
                        <Section
                            title="Persönliche Informationen"
                            onSave={handleSavePersonal}
                            onCancel={handleCancelPersonal}
                        >
                            <div className="grid gap-4 md:grid-cols-2">
                                <InputField
                                    label="Vorname"
                                    value={personal.firstName}
                                    onChange={(v) => updatePersonal('firstName', v)}
                                    required
                                />
                                <InputField
                                    label="Nachname"
                                    value={personal.lastName}
                                    onChange={(v) => updatePersonal('lastName', v)}
                                    required
                                />
                                <InputField
                                    label="E-Mail"
                                    type="email"
                                    value={personal.email}
                                    onChange={(v) => updatePersonal('email', v)}
                                    required
                                />

                                {/* Geschlecht */}
                                <div className="space-y-2">
                                    <label htmlFor="gender" className="text-sm font-semibold text-gray-600">
                                        Geschlecht
                                    </label>
                                    <select
                                        id="gender"
                                        value={personal.gender}
                                        onChange={(e) => updatePersonal('gender', e.target.value)}
                                        className="w-full rounded-xl border border-gray-200 px-4 py-3
                                                   focus:outline-none focus:ring-2 focus:ring-[#5555ff]"
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
                                    type="date"
                                    value={personal.dateOfBirth}
                                    onChange={(v) => updatePersonal('dateOfBirth', v)}
                                />
                                <InputField
                                    label="Telefon"
                                    type="tel"
                                    value={personal.phone}
                                    onChange={(v) => updatePersonal('phone', v)}
                                    placeholder="+43 699 12345678"
                                />
                                <InputField
                                    label="Beruf"
                                    value={personal.profession}
                                    onChange={(v) => updatePersonal('profession', v)}
                                    placeholder="z. B. Software-Entwickler:in"
                                />
                                <InputField
                                    label="Firma"
                                    value={personal.company}
                                    onChange={(v) => updatePersonal('company', v)}
                                    placeholder="z. B. Muster GmbH"
                                />
                            </div>

                            {/* Sprachen – volle Breite */}
                            <LanguageSelect
                                selected={personal.languages}
                                onChange={(langs) => updatePersonal('languages', langs)}
                            />

                            {/* Über mich */}
                            <div className="space-y-2">
                                <label htmlFor="about-me" className="text-sm font-semibold text-gray-600">
                                    Über mich
                                </label>
                                <textarea
                                    id="about-me"
                                    value={personal.aboutMe}
                                    onChange={(e) => updatePersonal('aboutMe', e.target.value)}
                                    rows={4}
                                    placeholder="Erzähl anderen, wer du bist…"
                                    className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3
                                               focus:outline-none focus:ring-2 focus:ring-[#5555ff]"
                                />
                            </div>
                        </Section>
                    )}

                    {/* ─── Adresse ─────────────────────────────────────────────────── */}
                    <Section
                        title="Adresse"
                        onSave={handleSaveAddress}
                        onCancel={handleCancelAddress}
                    >
                        <AddressFields
                            data={address}
                            onChange={updateAddress}
                            idPrefix="address"
                        />

                        {/* Rechnungsadresse gleich? */}
                        <div className="border-t border-gray-200 pt-6">
                            <h3 className="mb-4 text-base font-bold">
                                Ist die Rechnungsadresse dieselbe?
                            </h3>
                            <div className="flex gap-4">
                                {[
                                    { value: true, label: 'Ja' },
                                    { value: false, label: 'Nein' },
                                ].map(({ value, label }) => (
                                    <button
                                        key={label}
                                        type="button"
                                        onClick={() => setIsBillingSameAsAddress(value)}
                                        aria-pressed={isBillingSameAsAddress === value}
                                        className={`flex-1 rounded-xl border-2 px-6 py-3 font-semibold transition-all
                                                   ${isBillingSameAsAddress === value
                                            ? 'border-[#5555ff] bg-[#f5f5ff] text-[#5555ff]'
                                            : 'border-gray-200 text-gray-700 hover:border-gray-300'
                                        }`}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </Section>

                    {/* ─── Rechnungsadresse (nur wenn abweichend) ──────────────────── */}
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
                                    onChange={(v) => updateBilling('billingCompany', v)}
                                />
                                <InputField
                                    label="UID-Nummer (optional)"
                                    value={billing.billingVatNumber}
                                    onChange={(v) => updateBilling('billingVatNumber', v)}
                                    placeholder="ATU12345678"
                                />
                            </div>

                            <AddressFields
                                data={billing}
                                onChange={updateBilling}
                                idPrefix="billing"
                            />
                        </Section>
                    )}

                </div>
            </div>
        </>
    );
}
