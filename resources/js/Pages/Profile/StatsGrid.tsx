import { Award, Calendar, MapPin } from 'lucide-react';
import { useIntl } from 'react-intl';
import type { ReactNode } from 'react';
import type { AccountType, UserStats } from '@/types/profile';

interface StatsGridProps {
    role: AccountType;
    stats?: UserStats;
}

export function StatsGrid({ role, stats }: StatsGridProps) {
    const intl = useIntl();

    // Returns the translated text for the given translation key.
    const t = (id: string) => intl.formatMessage({ id });

    // Show statistics only for regular user accounts.
    if (role !== 'user') {
        return null;
    }

    return (
        <div className="mb-8 grid gap-6 md:grid-cols-3">
            <StatCard
                icon={<Calendar className="h-8 w-8 text-[#5555ff]" aria-hidden="true" />}
                label={t('profile.stats.totalBookings')}
                value={stats?.totalBookings}
            />

            <StatCard
                icon={<MapPin className="h-8 w-8 text-[#e63cff]" aria-hidden="true" />}
                label={t('profile.stats.visitedPlaces')}
                value={stats?.visitedPlaces}
            />

            <StatCard
                icon={<Award className="h-8 w-8 text-yellow-500" aria-hidden="true" />}
                label={t('profile.stats.favorites')}
                value={stats?.favorites}
            />
        </div>
    );
}

interface StatCardProps {
    icon: ReactNode;
    label: string;
    value?: number;
}

function StatCard({ icon, label, value }: StatCardProps) {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
            {/* Decorative statistic icon */}
            {icon}

            {/* Statistic label */}
            <p className="mb-1 mt-3 text-sm text-gray-600">
                {label}
            </p>

            {/* Statistic value with fallback while data is missing */}
            <p className="text-3xl font-bold">
                {value ?? '—'}
            </p>
        </div>
    );
}
