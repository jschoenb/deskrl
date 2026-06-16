import { useIntl } from 'react-intl';
import type { AccountType, VerificationStatus } from '@/types/profile';

interface VerificationSectionProps {
    user: {
        role: AccountType;
        verificationStatus: VerificationStatus;
    };
}

export function VerificationSection({ user }: VerificationSectionProps) {
    const intl = useIntl();

    // Returns the translated text for the given translation key.
    const t = (id: string) => intl.formatMessage({ id });

    // Hide this section for regular users and admins.
    if (user.role === 'user' || user.role === 'admin') {
        return null;
    }

    return (
        <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-6">
            <h2 className="mb-2 text-xl font-bold text-gray-950">
                {t('profile.verificationSection.title')}
            </h2>

            <p className="text-sm text-gray-600">
                {t('profile.verificationSection.description')}
            </p>

            {/* TODO: Add commercial verification upload later.
                Future implementation should include document type selection,
                secure file upload, pending verification status and admin review.
            */}
        </div>
    );
}
