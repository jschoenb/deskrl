import AppLayout from '@/Layouts/AppLayout';
import { InertiaPage } from '@/types/inertia';
import AuthModal from '@/components/AuthModal';
import { Calendar } from 'lucide-react';
import { usePage } from '@inertiajs/react';
import { useState } from 'react';

const Bookings: InertiaPage = () => {
    const { props } = usePage();
    const { auth } = props as any;

    const isLoggedIn = !!auth?.user;
    const [showAuthModal, setShowAuthModal] = useState(false);

    // Guests see a login hint instead of booking content.
    if (!isLoggedIn) {
        return (
            <>
                <div className="min-h-[70vh] bg-white flex items-center justify-center px-4">
                    <div className="text-center max-w-md">
                        <div className="w-20 h-20 bg-[#f5f5ff] rounded-full flex items-center justify-center mx-auto mb-6">
                            <Calendar className="w-10 h-10 text-[#5555ff]" />
                        </div>

                        <h1 className="text-3xl font-bold mb-4 text-gray-900">
                            Meine Buchungen
                        </h1>

                        <p className="text-gray-600 mb-6">
                            Melde dich an, um deine Buchungen zu sehen und neue Buchungen zu verwalten.
                        </p>

                        <button
                            type="button"
                            onClick={() => setShowAuthModal(true)}
                            className="inline-block bg-[#5555ff] hover:bg-[#4444ee] text-white px-8 py-3 rounded-xl transition-colors font-bold"
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

    // Logged-in users see the booking page placeholder for now.
    return (
        <div className="min-h-[70vh] bg-white px-4 py-16">
            <div className="max-w-7xl mx-auto">
                <div className="bg-gradient-to-br from-[#5555ff] via-[#7575ff] to-[#e63cff] text-white rounded-3xl p-8 md:p-12 mb-10">
                    <div className="flex items-center gap-3 mb-4">
                        <Calendar className="w-8 h-8" />

                        <h1 className="text-4xl md:text-5xl font-extrabold">
                            Meine Buchungen
                        </h1>
                    </div>

                    <p className="text-white/90 text-lg">
                        Hier findest du später deine aktuellen und vergangenen Buchungen.
                    </p>
                </div>

                <div className="text-center py-16">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Calendar className="w-12 h-12 text-gray-400" />
                    </div>

                    <h2 className="text-2xl font-bold mb-4 text-gray-900">
                        Noch keine Buchungen
                    </h2>

                    <p className="text-gray-600">
                        Sobald du einen Raum buchst, erscheint deine Buchung hier.
                    </p>
                </div>
            </div>
        </div>
    );
};

Bookings.layout = page => <AppLayout>{page}</AppLayout>;

export default Bookings;
