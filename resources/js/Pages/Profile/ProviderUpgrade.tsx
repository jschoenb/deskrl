import { ArrowRight } from 'lucide-react';
import type { AccountType } from '@/types/profile';

interface ProviderUpgradeProps {
    role: AccountType;
    onUpgradeClick: () => void;
}

export function ProviderUpgrade({ role, onUpgradeClick }: ProviderUpgradeProps) {
    // Show this upgrade box only for regular user accounts.
    if (role !== 'user') {
        return null;
    }

    return (
        <div className="mb-8 rounded-2xl bg-gradient-to-br from-[#e63cff] to-[#ff6cff] p-6 text-white sm:p-8">
            <div className="flex flex-col items-start gap-6 sm:flex-row">
                {/* Decorative icon area */}
                <div
                    className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 text-3xl backdrop-blur-sm sm:h-20 sm:w-20 sm:text-4xl"
                    aria-hidden="true"
                >
                    🚀
                </div>

                <div className="flex-1">
                    <h2 className="mb-3 text-xl font-bold sm:text-2xl">
                        Werde Anbieter:in auf Deskrl
                    </h2>

                    <p className="mb-6 leading-relaxed opacity-95">
                        Vermiete deinen Schreibtisch, dein Büro oder deinen Meetingraum –
                        und verdiene nebenbei Geld.
                    </p>

                    {/* Open the same provider upgrade modal as the header button. */}
                    <button
                        type="button"
                        onClick={onUpgradeClick}
                        className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3 font-bold text-[#e63cff] shadow-lg transition-colors hover:bg-gray-50"
                    >
                        Raum anbieten
                        <ArrowRight className="h-5 w-5" aria-hidden="true" />
                    </button>
                </div>
            </div>
        </div>
    );
}
