// resources/js/Pages/Profile/components/ProviderUpgrade.tsx
import { ArrowRight } from 'lucide-react';

interface ProviderUpgradeProps {
    user: {
        role: string;
    };
}

export function ProviderUpgrade({ user }: ProviderUpgradeProps) {
    if (user.role === 'host') return null;

    return (
        <div className="bg-gradient-to-br from-[#e63cff] to-[#ff6cff] rounded-2xl p-8 mb-8 text-white">
            <div className="flex items-start gap-6">
                <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center text-4xl backdrop-blur-sm">
                    🚀
                </div>
                <div className="flex-1">
                    <h2 className="text-2xl mb-3 font-bold">Werde Anbieter:in</h2>
                    <p className="leading-relaxed opacity-95 mb-6">
                        Verdiene Geld, indem du deine Räume oder Arbeitsplätze auf Deskrl anbietest.
                    </p>
                    <button className="bg-white text-[#e63cff] px-8 py-3 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-lg font-bold">
                        Raum anbieten
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
