// resources/js/Pages/Profile/components/StatsGrid.tsx
import { Calendar, MapPin, Award } from 'lucide-react';

interface StatsGridProps {
    stats?: {
        totalBookings?: number;
        visitedPlaces?: number;
        favorites?: number;
    };
}

export function StatsGrid({ stats }: StatsGridProps) {
    return (
        <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <Calendar className="w-8 h-8 text-[#5555ff] mb-3" />
                <p className="text-sm text-gray-600 mb-1">Gesamtbuchungen</p>
                <p className="text-3xl font-bold">{stats?.totalBookings ?? '—'}</p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <MapPin className="w-8 h-8 text-[#e63cff] mb-3" />
                <p className="text-sm text-gray-600 mb-1">Besuchte Orte</p>
                <p className="text-3xl font-bold">{stats?.visitedPlaces ?? '—'}</p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <Award className="w-8 h-8 text-yellow-500 mb-3" />
                <p className="text-sm text-gray-600 mb-1">Favoriten</p>
                <p className="text-3xl font-bold">{stats?.favorites ?? '—'}</p>
            </div>
        </div>
    );
}
