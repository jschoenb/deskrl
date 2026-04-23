// resources/js/Pages/Profile/components/VerificationSection.tsx
import { CheckCircle, AlertCircle, Clock, Award } from 'lucide-react';

interface VerificationSectionProps {
    user: {
        role: string;
        verificationStatus: string;
    };
}

export function VerificationSection({ user }: VerificationSectionProps) {
    if (user.role !== 'user') return null;

    return (
        <div className="bg-white rounded-2xl p-8 border border-gray-200 mb-8">
            <h2 className="text-2xl mb-6 font-bold">Persönliche Verifizierung</h2>
            <div className="bg-[#f5f5ff] rounded-xl p-6 border border-[#5555ff]/20 mb-6">
                <div className="flex items-start gap-4">
                    <Award className="w-8 h-8 text-[#5555ff] flex-shrink-0 mt-1" />
                    <div>
                        <h3 className="text-lg mb-2 font-bold">Verifizierung empfohlen</h3>
                        <p className="text-gray-700 mb-4">
                            Erhöhe dein Vertrauen bei anderen Nutzer:innen, indem du dein Profil verifizierst.
                        </p>
                        <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1 bg-white rounded-lg text-sm flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-green-600" />
                Höheres Vertrauen
              </span>
                            <span className="px-3 py-1 bg-white rounded-lg text-sm flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-green-600" />
                Bessere Sichtbarkeit
              </span>
                        </div>
                    </div>
                </div>
            </div>
            <button className="w-full py-3 bg-[#5555ff] hover:bg-[#4444ee] text-white rounded-xl transition-colors flex items-center justify-center gap-2 font-bold">
                <Award className="w-5 h-5" />
                Jetzt verifizieren
            </button>
        </div>
    );
}
