// Reusable verification status badge for profile and other account-related views.

import { AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { useIntl } from 'react-intl';
import type { ElementType } from 'react';
import type { VerificationStatus } from '@/types/profile';

interface VerificationBadgeProps {
    status: VerificationStatus | null | undefined;
}

const CONFIG = {
    verified: {
        icon: CheckCircle,
        labelKey: 'profile.verification.verified',
        className: 'bg-green-100 text-green-700',
    },
    pending: {
        icon: Clock,
        labelKey: 'profile.verification.pending',
        className: 'bg-yellow-100 text-yellow-700',
    },
    rejected: {
        icon: AlertCircle,
        labelKey: 'profile.verification.rejected',
        className: 'bg-red-100 text-red-700',
    },
    unverified: {
        icon: AlertCircle,
        labelKey: 'profile.verification.unverified',
        className: 'bg-gray-100 text-gray-700',
    },
} satisfies Record<VerificationStatus, { icon: ElementType; labelKey: string; className: string }>;

export function VerificationBadge({ status }: VerificationBadgeProps) {
    const intl = useIntl();

    // Returns the translated text for the given translation key.
    const t = (id: string) => intl.formatMessage({ id });

    const key = (status ?? 'unverified') as VerificationStatus;
    const { icon: Icon, labelKey, className } = CONFIG[key] ?? CONFIG.unverified;

    return (
        <span className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold ${className}`}>
            <Icon className="h-4 w-4" aria-hidden="true" />
            {t(labelKey)}
        </span>
    );
}
