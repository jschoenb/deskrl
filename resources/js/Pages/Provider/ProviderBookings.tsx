import AppLayout from '@/Layouts/AppLayout';
import { InertiaPage } from '@/types/inertia';
import { Calendar } from 'lucide-react';
import { useIntl } from 'react-intl';
import type { ReactNode } from 'react';

const ProviderBookings: InertiaPage = () => {
    const intl = useIntl();

    // Returns the translated text for the given translation key.
    const t = (id: string) => intl.formatMessage({ id });

    return (
        <>
            {/* Full-width provider bookings header */}
            <div className="relative left-1/2 right-1/2 mb-8 w-screen -ml-[50vw] -mr-[50vw] bg-gradient-to-br from-[#5555ff] via-[#7575ff] to-[#e63cff] px-4 py-16 text-white">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-4 flex items-center gap-3">
                        <Calendar className="h-8 w-8 text-white" />

                        <h1 className="text-4xl font-extrabold md:text-5xl">
                            {t('providerBookings.title')}
                        </h1>
                    </div>

                    <p className="text-lg text-white/90">
                        {t('providerBookings.description')}
                    </p>
                </div>
            </div>

            {/* MVP placeholder content */}
            <div className="mx-auto max-w-7xl px-4 pb-12 md:px-8">
                <div className="py-16 text-center">
                    {/* Decorative empty-state icon */}
                    <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
                        <Calendar className="h-12 w-12 text-gray-400" />
                    </div>

                    <h2 className="mb-4 text-2xl font-bold text-gray-900">
                        {t('providerBookings.emptyTitle')}
                    </h2>

                    <p className="text-gray-600">
                        {t('providerBookings.emptyDescription')}
                    </p>
                </div>
            </div>
        </>
    );
};

ProviderBookings.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>;

export default ProviderBookings;
