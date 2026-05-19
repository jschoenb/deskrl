// ─── Pages/Profile/StatsGrid.tsx ─────────────────────────────────────────────
// Fix gegenüber deiner Version:
// - Früher: Immer angezeigt (fehlender Role-Guard)
// - Jetzt: Nur für 'user'-Rolle sichtbar (Figma-Code: "Only for regular users, not providers")
// - Stats werden als Props übergeben statt hartcodiert

import { Award, Calendar, MapPin } from 'lucide-react';
import type { UserRole, UserStats } from '../../types/profile';

interface StatsGridProps {
    role: UserRole;
    stats?: UserStats;
}

export function StatsGrid({ role, stats }: StatsGridProps) {
    // Nur für reguläre Nutzer anzeigen, nicht für Hosts/Admins
    if (role !== 'user') return null;

    return (
        <div className="mb-8 grid gap-6 md:grid-cols-3">
            <StatCard
                icon={<Calendar className="h-8 w-8 text-[#5555ff]" aria-hidden="true" />}
                label="Gesamtbuchungen"
                value={stats?.totalBookings}
            />
            <StatCard
                icon={<MapPin className="h-8 w-8 text-[#e63cff]" aria-hidden="true" />}
                label="Besuchte Orte"
                value={stats?.visitedPlaces}
            />
            <StatCard
                icon={<Award className="h-8 w-8 text-yellow-500" aria-hidden="true" />}
                label="Favoriten"
                value={stats?.favorites}
            />
        </div>
    );
}

// Kleines Sub-Komponente – kein eigenes File nötig, da nur hier verwendet
interface StatCardProps {
    icon: React.ReactNode;
    label: string;
    value?: number;
}

function StatCard({ icon, label, value }: StatCardProps) {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
            {icon}
            <p className="mb-1 mt-3 text-sm text-gray-600">{label}</p>
            <p className="text-3xl font-bold">{value ?? '—'}</p>
        </div>
    );
}
