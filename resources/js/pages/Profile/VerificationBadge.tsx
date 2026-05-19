// ─── Pages/Profile/VerificationBadge.tsx ─────────────────────────────────────
// Vorher: getVerificationStatusBadge() war eine Funktion in der Page die JSX returned.
// Nachher: Saubere Komponente, wiederverwendbar (z.B. auch in einer Buchungsübersicht).

import { AlertCircle, CheckCircle, Clock } from 'lucide-react';
import type { VerificationStatus } from '../../types/profile';

interface VerificationBadgeProps {
    status: VerificationStatus | null | undefined;
}

const CONFIG = {
    verified: {
        icon: CheckCircle,
        label: 'Verifiziert',
        className: 'bg-green-100 text-green-700',
    },
    pending: {
        icon: Clock,
        label: 'Verifizierung ausstehend',
        className: 'bg-yellow-100 text-yellow-700',
    },
    rejected: {
        icon: AlertCircle,
        label: 'Abgelehnt',
        className: 'bg-red-100 text-red-700',
    },
    unverified: {
        icon: AlertCircle,
        label: 'Nicht verifiziert',
        className: 'bg-gray-100 text-gray-700',
    },
} satisfies Record<VerificationStatus, { icon: React.ElementType; label: string; className: string }>;

export function VerificationBadge({ status }: VerificationBadgeProps) {
    const key = (status ?? 'unverified') as VerificationStatus;
    const { icon: Icon, label, className } = CONFIG[key] ?? CONFIG.unverified;

    return (
        <span className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold ${className}`}>
            <Icon className="h-4 w-4" aria-hidden="true" />
            {label}
        </span>
    );
}
