import AppLayout from '@/Layouts/AppLayout';
import { InertiaPage } from '@/types/inertia';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import type { ReactNode } from 'react';

import { useProfileForm } from '@/hooks/useProfileForm';
import { ProfileHeader } from './Profile/ProfileHeader';
import { StatsGrid } from './Profile/StatsGrid';
import { ProviderUpgrade } from './Profile/ProviderUpgrade';
import { VerificationSection } from './Profile/VerificationSection';
import { CommercialVerificationModal } from './Profile/CommercialVerificationModal';
import { PersonalInformationSection } from './Profile/PersonalInformationSection';
import { BusinessInformationSection } from './Profile/BusinessInformationSection';
import { AddressSection } from './Profile/AddressSection';

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
    const intl = useIntl();

    const [showCommercialVerificationModal, setShowCommercialVerificationModal] = useState(false);

    // Returns the translated text for the given translation key.
    const t = (id: string) => intl.formatMessage({ id });

    const {
        personal,
        address,
        billing,
        business,
        isBillingSameAsAddress,

        personalErrors,
        addressErrors,
        billingErrors,
        businessErrors,

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

    const role = account.account_type ?? 'user';

    const isHost = role === 'private_host' || role === 'commercial_host';

    const isCommercialHost = role === 'commercial_host';

    const verificationStatus: VerificationStatus = account.email_verified ? 'verified' : 'unverified';

    return (
        <>
            <Head title={t('profile.page.title')} />

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

                    {!isHost && (
                        <StatsGrid role={role} stats={stats} />
                    )}

                    {!isHost && (
                        <ProviderUpgrade
                            role={role}
                            onUpgradeClick={() => setShowCommercialVerificationModal(true)}
                        />
                    )}

                    {isHost && (
                        <VerificationSection
                            user={{
                                role,
                                verificationStatus,
                            }}
                        />
                    )}

                    <PersonalInformationSection
                        personal={personal}
                        personalErrors={personalErrors}
                        isCommercialHost={isCommercialHost}
                        updatePersonal={updatePersonal}
                        onSave={handleSavePersonal}
                        onCancel={handleCancelPersonal}
                    />

                    {isCommercialHost && (
                        <BusinessInformationSection
                            business={business}
                            businessErrors={businessErrors}
                            updateBusiness={updateBusiness}
                            onSave={handleSaveBusiness}
                            onCancel={handleCancelBusiness}
                        />
                    )}

                    <AddressSection
                        address={address}
                        billing={billing}
                        isHost={isHost}
                        isBillingSameAsAddress={isBillingSameAsAddress}
                        addressErrors={addressErrors}
                        billingErrors={billingErrors}
                        updateAddress={updateAddress}
                        updateBilling={updateBilling}
                        setIsBillingSameAsAddress={setIsBillingSameAsAddress}
                        onSaveAddress={handleSaveAddress}
                        onCancelAddress={handleCancelAddress}
                        onSaveBilling={handleSaveBilling}
                        onCancelBilling={handleCancelBilling}
                    />
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
