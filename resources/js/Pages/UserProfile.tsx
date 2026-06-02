import AppLayout from '@/Layouts/AppLayout';
import {InertiaPage} from '@/types/inertia';
import {Head} from '@inertiajs/react';
import {useState} from 'react';
import type {ReactNode} from 'react';

import {useProfileForm} from '@/hooks/useProfileForm';
import {ProfileHeader} from './Profile/ProfileHeader';
import {StatsGrid} from './Profile/StatsGrid';
import {ProviderUpgrade} from './Profile/ProviderUpgrade';
import {VerificationSection} from './Profile/VerificationSection';
import {CommercialVerificationModal} from './Profile/CommercialVerificationModal';
import {PersonalInformationSection} from './Profile/PersonalInformationSection';
import {BusinessInformationSection} from './Profile/BusinessInformationSection';
import {AddressSection} from './Profile/AddressSection';

import type {UserFromBackend, VerificationStatus} from '@/types/profile';

interface UserProfileProps {
    account: UserFromBackend;
    stats?: {
        totalBookings: number;
        visitedPlaces: number;
        favorites: number;
    };
}

const UserProfile: InertiaPage<UserProfileProps> = ({account, stats}) => {
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
            <Head title="Mein Profil"/>

            <div className="min-h-screen bg-gray-50">
                <div className="mx-auto max-w-4xl px-4 py-12">
                    {/* Profile header is handled inside ProfileHeader.tsx. */}
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

                    {/* User statistics are handled inside StatsGrid.tsx. */}
                    {!isHost && (
                        <StatsGrid role={role} stats={stats}/>
                    )}

                    {/* Provider upgrade card is handled inside ProviderUpgrade.tsx. */}
                    {!isHost && (
                        <ProviderUpgrade
                            role={role}
                            onUpgradeClick={() => setShowCommercialVerificationModal(true)}
                        />
                    )}

                    {/* MVP provider verification notice is handled inside VerificationSection.tsx. */}
                    {isHost && (
                        <VerificationSection
                            user={{
                                role,
                                verificationStatus,
                            }}
                        />
                    )}

                    {/* Personal profile data is handled inside PersonalInformationSection.tsx. */}
                    <PersonalInformationSection
                        personal={personal}
                        isCommercialHost={isCommercialHost}
                        updatePersonal={updatePersonal}
                        onSave={handleSavePersonal}
                        onCancel={handleCancelPersonal}
                    />

                    {/* Business profile data is handled inside BusinessInformationSection.tsx. */}
                    {isCommercialHost && (
                        <BusinessInformationSection
                            business={business}
                            updateBusiness={updateBusiness}
                            onSave={handleSaveBusiness}
                            onCancel={handleCancelBusiness}
                        />
                    )}

                    {/* Main address and billing address data are handled inside AddressSection.tsx. */}
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

            {/* Provider upgrade modal is handled inside CommercialVerificationModal.tsx. */}
            <CommercialVerificationModal
                isOpen={showCommercialVerificationModal}
                onClose={() => setShowCommercialVerificationModal(false)}
            />
        </>
    );
};

UserProfile.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>;

export default UserProfile;
