import type {AccountType, VerificationStatus} from '@/types/profile';

interface VerificationSectionProps {
    user: {
        role: AccountType;
        verificationStatus: VerificationStatus;
    };
}

export function VerificationSection({user}: VerificationSectionProps) {
    // Hide this section for regular users and admins.
    if (user.role === 'user' || user.role === 'admin') {
        return null;
    }

    return (
        <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-6">
            <h2 className="mb-2 text-xl font-bold text-gray-950">
                Anbieter:innen-Verifizierung
            </h2>

            <p className="text-sm text-gray-600">
                Eine Verifizierung wird später vor allem für kommerzielle Anbieter:innen relevant sein.
                Im MVP wird dieser Schritt vorerst nur angezeigt und noch nicht technisch geprüft.
            </p>

            {/* TODO: Add commercial verification upload later.
                Future implementation should include document type selection,
                secure file upload, pending verification status and admin review.
            */}
        </div>
    );
}
