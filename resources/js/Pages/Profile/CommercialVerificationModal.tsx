import { router } from '@inertiajs/react';
import { useState } from 'react';
import { Building2, Home, X } from 'lucide-react';

type ProviderType = 'private_host' | 'commercial_host';

type CommercialVerificationModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

export function CommercialVerificationModal({
                                                isOpen,
                                                onClose,
                                            }: CommercialVerificationModalProps) {
    const [providerType, setProviderType] = useState<ProviderType>('private_host');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Do not render the modal when it is closed.
    if (!isOpen) {
        return null;
    }

    // Send the selected provider type to the Laravel backend.
    const handleConfirm = () => {
        setIsSubmitting(true);

        router.post(
            '/become-provider',
            {
                provider_type: providerType,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    onClose();
                },
                onFinish: () => {
                    setIsSubmitting(false);
                },
            },
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl">
                {/* Modal header */}
                <div className="mb-6 flex items-start justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-950">
                            Anbieter:in werden
                        </h2>

                        <p className="mt-2 text-sm text-gray-600">
                            Wähle aus, ob du privat oder gewerblich Räume anbieten möchtest.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                        aria-label="Modal schließen"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Provider type selection */}
                <div className="mb-6 grid gap-4 md:grid-cols-2">
                    <button
                        type="button"
                        onClick={() => setProviderType('private_host')}
                        className={`rounded-xl border-2 p-5 text-left transition ${
                            providerType === 'private_host'
                                ? 'border-[#5555ff] bg-[#f5f5ff]'
                                : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                        <div className="mb-3 flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#5555ff] text-white">
                                <Home className="h-5 w-5" />
                            </div>

                            <h3 className="font-bold text-gray-950">
                                Private:r Anbieter:in
                            </h3>
                        </div>

                        <p className="text-sm text-gray-600">
                            Für Personen, die eigene Arbeitsplätze oder Räume privat anbieten möchten.
                        </p>
                    </button>

                    <button
                        type="button"
                        onClick={() => setProviderType('commercial_host')}
                        className={`rounded-xl border-2 p-5 text-left transition ${
                            providerType === 'commercial_host'
                                ? 'border-[#5555ff] bg-[#f5f5ff]'
                                : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                        <div className="mb-3 flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e63cff] text-white">
                                <Building2 className="h-5 w-5" />
                            </div>

                            <h3 className="font-bold text-gray-950">
                                Gewerbliche:r Anbieter:in
                            </h3>
                        </div>

                        <p className="text-sm text-gray-600">
                            Für Unternehmen, Coworking-Spaces oder gewerbliche Raumangebote.
                        </p>
                    </button>
                </div>

                {/* MVP verification notice for commercial providers */}
                {providerType === 'commercial_host' && (
                    <div className="mb-6 rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
                        Für gewerbliche Anbieter:innen wird später ein Verifizierungsdokument benötigt,
                        zum Beispiel ein Firmenbuchauszug oder Gewerbeschein. Im MVP wird dieser Schritt
                        vorerst nur angezeigt und noch nicht technisch geprüft.
                    </div>
                )}

                {/* Modal actions */}
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 rounded-xl bg-gray-100 px-4 py-3 font-semibold text-gray-900 hover:bg-gray-200"
                    >
                        Abbrechen
                    </button>

                    <button
                        type="button"
                        onClick={handleConfirm}
                        disabled={isSubmitting}
                        className="flex-1 rounded-xl bg-[#5555ff] px-4 py-3 font-semibold text-white hover:bg-[#4444ee] disabled:cursor-not-allowed disabled:bg-gray-300"
                    >
                        {isSubmitting ? 'Wird gespeichert...' : 'Fortfahren'}
                    </button>
                </div>
            </div>
        </div>
    );
}
