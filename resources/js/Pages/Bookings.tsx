import AppLayout from '@/Layouts/AppLayout';
import { InertiaPage } from '@/types/inertia';
import AuthModal from '@/components/AuthModal';
import BookingList, { Booking } from '@/components/BookingList';
import { Calendar } from 'lucide-react';
import { usePage } from '@inertiajs/react';
import { useState } from 'react';
import type { ReactNode } from 'react';

type PageProps = {
    auth?: {
        user?: {
            id: number;
            first_name?: string;
            last_name?: string;
            email?: string;
        } | null;
    };
    bookings?: Booking[];
};

const Bookings: InertiaPage = () => {
    const { props } = usePage<PageProps>();

    const auth = props.auth;
    const bookings = props.bookings ?? [];

    const isLoggedIn = Boolean(auth?.user);
    const [showAuthModal, setShowAuthModal] = useState(false);

    // Temporary debug:
    // Open the browser console and check whether bookings arrive from Laravel.
    console.log('Bookings page props:', props);
    console.log('Bookings:', bookings);

    if (!isLoggedIn) {
        return (
            <>
                <div className="flex min-h-[70vh] items-center justify-center bg-white px-4">
                    <div className="max-w-md text-center">
                        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#f5f5ff]">
                            <Calendar className="h-10 w-10 text-[#5555ff]" />
                        </div>

                        <h1 className="mb-4 text-3xl font-bold text-gray-900">
                            Meine Buchungen
                        </h1>

                        <p className="mb-6 text-gray-600">
                            Melde dich an, um deine Buchungen zu sehen und neue Buchungen zu verwalten.
                        </p>

                        <button
                            type="button"
                            onClick={() => setShowAuthModal(true)}
                            className="inline-block rounded-xl bg-[#5555ff] px-8 py-3 font-bold text-white transition-colors hover:bg-[#4444ee]"
                        >
                            Jetzt anmelden
                        </button>
                    </div>
                </div>

                <AuthModal
                    isOpen={showAuthModal}
                    onClose={() => setShowAuthModal(false)}
                    initialMode="login"
                />
            </>
        );
    }

    return (
        <>
            <div className="relative left-1/2 right-1/2 mb-8 w-screen -ml-[50vw] -mr-[50vw] bg-gradient-to-br from-[#5555ff] via-[#7575ff] to-[#e63cff] px-4 py-16 text-white">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-4 flex items-center gap-3">
                        <Calendar className="h-8 w-8 text-white" />

                        <h1 className="text-4xl font-extrabold md:text-5xl">
                            Meine Buchungen
                        </h1>
                    </div>

                    <p className="text-lg text-white/90">
                        Hier findest du deine aktuellen, angefragten und vergangenen Buchungen.
                    </p>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 pb-12 md:px-8">
                <BookingList bookings={bookings} />
            </div>
        </>
    );
};

Bookings.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>;

export default Bookings;
