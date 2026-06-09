import AppLayout from '@/Layouts/AppLayout';
import { InertiaPage } from '@/types/inertia';
import { Building2 } from 'lucide-react';
import type { ReactNode } from 'react';

const ProviderDashboard: InertiaPage = () => {
    return (
        <>
            {/* Full-width provider dashboard header */}
            <div className="relative left-1/2 right-1/2 mb-8 w-screen -ml-[50vw] -mr-[50vw] bg-gradient-to-br from-[#5555ff] via-[#7575ff] to-[#e63cff] px-4 py-16 text-white">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-4 flex items-center gap-3">
                        <Building2 className="h-8 w-8 text-white" />

                        <h1 className="text-4xl font-extrabold md:text-5xl">
                            Anbieter:innen Dashboard
                        </h1>
                    </div>

                    <p className="text-lg text-white/90">
                        Verwalte deine Räume und überwache deine Einnahmen.
                    </p>
                </div>
            </div>

            {/* MVP placeholder content */}
            <div className="mx-auto max-w-7xl px-4 pb-12 md:px-8">
                <div className="py-16 text-center">
                    {/* Decorative empty-state icon */}
                    <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
                        <Building2 className="h-12 w-12 text-gray-400" />
                    </div>

                    <h2 className="mb-4 text-2xl font-bold text-gray-900">
                        Noch keine Räume angelegt
                    </h2>

                    <p className="text-gray-600">
                        Hier werden später deine angebotenen Räume und Einnahmen angezeigt.
                    </p>
                </div>
            </div>
        </>
    );
};

ProviderDashboard.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>;

export default ProviderDashboard;
