// ─── Pages/Profile/VerificationSection.tsx ───────────────────────────────────
// GROSSER FIX: Im Figma-Code gab es 3 fast identische Verification-Blöcke
// (für user, private provider, business provider). Das war ~300 Zeilen duplizierter Code.
// Jetzt: 1 Komponente mit rollenspezifischer Konfiguration.

import { Award, CheckCircle, Clock, FileText, Upload } from 'lucide-react';
import { useState } from 'react';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';
import type { UserRole, VerificationStatus } from '../../types/profile';

interface VerificationSectionProps {
    user: {
        role: UserRole;
        verificationStatus: VerificationStatus;
    };
}

// Rollenspezifische Texte
const ROLE_CONFIG = {
    user: {
        title: 'Persönliche Verifizierung',
        recommendedText:
            'Erhöhe dein Vertrauen bei Anbieter:innen, indem du dein Profil verifizierst.',
        verifiedText: 'Dein Profil ist verifiziert. Buchungsanfragen werden bevorzugt behandelt.',
        benefits: ['Höheres Vertrauen', 'Bevorzugte Buchungen', 'Vertrauens-Badge'],
        isRequired: false,
    },
    host: {
        title: 'Anbieter-Verifizierung',
        recommendedText:
            'Verifiziere dein Anbieter-Profil für höhere Sichtbarkeit und mehr Buchungen.',
        verifiedText:
            'Dein Anbieter-Profil ist verifiziert. Deine Angebote werden bevorzugt angezeigt.',
        benefits: ['Höheres Vertrauen', 'Bessere Sichtbarkeit', 'Vertrauens-Badge'],
        isRequired: false,
    },
    admin: null, // Admins brauchen keine Verifizierung
} as const;

export function VerificationSection({ user }: VerificationSectionProps) {
    const config = ROLE_CONFIG[user.role];
    // Admins überspringen
    if (!config) return null;

    const status = user.verificationStatus;

    return (
        <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-4 sm:p-8">
            <h2 className="mb-6 text-xl font-bold sm:text-2xl">{config.title}</h2>

            {status === 'verified' && <VerifiedState text={config.verifiedText} />}
            {status === 'pending' && <PendingState />}
            {(status === 'unverified' || status === 'rejected') && (
                <UnverifiedState
                    text={config.recommendedText}
                    benefits={config.benefits}
                    wasRejected={status === 'rejected'}
                />
            )}
        </div>
    );
}

// ─── Sub-Komponenten ──────────────────────────────────────────────────────────

function VerifiedState({ text }: { text: string }) {
    return (
        <div className="rounded-xl border border-green-200 bg-green-50 p-6">
            <div className="flex items-start gap-4">
                <CheckCircle className="mt-1 h-8 w-8 flex-shrink-0 text-green-600" aria-hidden="true" />
                <div>
                    <h3 className="mb-2 text-lg font-bold">Verifiziert ✓</h3>
                    <p className="text-gray-700">{text}</p>
                </div>
            </div>
        </div>
    );
}

function PendingState() {
    return (
        <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-6">
            <div className="flex items-start gap-4">
                <Clock className="mt-1 h-8 w-8 flex-shrink-0 text-yellow-600" aria-hidden="true" />
                <div>
                    <h3 className="mb-2 text-lg font-bold">Verifizierung ausstehend</h3>
                    <p className="text-gray-700">
                        Dein Dokument wird geprüft. Dies dauert in der Regel 1–2 Werktage.
                    </p>
                </div>
            </div>
        </div>
    );
}

interface UnverifiedStateProps {
    text: string;
    benefits: readonly string[];
    wasRejected: boolean;
}

function UnverifiedState({ text, benefits, wasRejected }: UnverifiedStateProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [docType, setDocType] = useState('personalausweis');
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 10 * 1024 * 1024) {
            toast.error('Datei zu groß. Maximale Größe: 10 MB');
            return;
        }
        setSelectedFile(file);
    };

    const handleUpload = () => {
        if (!selectedFile) {
            toast.error('Bitte wähle zuerst eine Datei aus.');
            return;
        }

        setIsUploading(true);
        router.post(
            '/profile/verify',
            { document: selectedFile, document_type: docType },
            {
                forceFormData: true,
                onSuccess: () => {
                    toast.success('Dokument eingereicht. Wir melden uns bald.');
                    setSelectedFile(null);
                },
                onError: () => toast.error('Fehler beim Einreichen.'),
                onFinish: () => setIsUploading(false),
            }
        );
    };

    return (
        <div>
            {wasRejected && (
                <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    Deine letzte Einreichung wurde abgelehnt. Bitte lade ein gültiges Dokument hoch.
                </div>
            )}

            {/* Info-Box */}
            <div className="mb-6 rounded-xl border border-[#5555ff]/20 bg-[#f5f5ff] p-6">
                <div className="flex items-start gap-4">
                    <Award className="mt-1 h-8 w-8 flex-shrink-0 text-[#5555ff]" aria-hidden="true" />
                    <div>
                        <h3 className="mb-2 text-lg font-bold">Verifizierung empfohlen</h3>
                        <p className="mb-4 text-gray-700">{text}</p>
                        <div className="flex flex-wrap gap-2">
                            {benefits.map((benefit) => (
                                <span
                                    key={benefit}
                                    className="flex items-center gap-1 rounded-lg bg-white px-3 py-1 text-sm"
                                >
                                    <CheckCircle className="h-4 w-4 text-green-600" aria-hidden="true" />
                                    {benefit}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Upload-Formular */}
            <div className="space-y-4">
                <div className="space-y-2">
                    <label htmlFor="doc-type" className="text-sm font-semibold text-gray-700">
                        Dokumenttyp
                    </label>
                    <select
                        id="doc-type"
                        value={docType}
                        onChange={(e) => setDocType(e.target.value)}
                        className="w-full rounded-xl border border-gray-200 px-4 py-3
                                   focus:outline-none focus:ring-2 focus:ring-[#5555ff]"
                    >
                        <option value="personalausweis">Personalausweis</option>
                        <option value="reisepass">Reisepass</option>
                        <option value="fuehrerschein">Führerschein</option>
                        <option value="firmenbuch">Firmenbuchauszug</option>
                        <option value="gewerbeschein">Gewerbeschein</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Dokument hochladen</label>
                    <label className="flex cursor-pointer items-center justify-center gap-3 rounded-xl
                                      border-2 border-dashed border-gray-300 px-4 py-6
                                      transition-colors hover:border-[#5555ff]">
                        <FileText className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        <span className="text-gray-600">
                            {selectedFile ? selectedFile.name : 'Datei auswählen…'}
                        </span>
                        <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={handleFileChange}
                            className="hidden"
                            aria-label="Verifizierungsdokument auswählen"
                        />
                    </label>
                    <p className="text-xs text-gray-500">Erlaubte Formate: PDF, JPG, PNG – max. 10 MB</p>
                </div>

                <button
                    onClick={handleUpload}
                    disabled={!selectedFile || isUploading}
                    aria-busy={isUploading}
                    className="flex w-full items-center justify-center gap-2 rounded-xl py-3
                               font-semibold transition-colors
                               enabled:bg-[#5555ff] enabled:text-white enabled:hover:bg-[#4444ee]
                               disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
                >
                    <Upload className="h-5 w-5" aria-hidden="true" />
                    {isUploading ? 'Wird eingereicht…' : 'Einreichen & verifizieren'}
                </button>
            </div>
        </div>
    );
}
