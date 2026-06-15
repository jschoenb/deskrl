import { router } from '@inertiajs/react';
import { useState } from 'react';
import { Building2, Home, X } from 'lucide-react';
import { useIntl } from 'react-intl';

type ProviderType = 'private_host' | 'commercial_host';

type CommercialVerificationModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

export function CommercialVerificationModal({
                                                isOpen,
                                                onClose,
                                            }: CommercialVerificationModalProps) {
    const intl = useIntl();

    const [providerType, setProviderType] = useState<ProviderType>('private_host');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Returns the translated text for the given translation key.
    const t = (id: string) => intl.formatMessage({ id });

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
                            {t('providerUpgrade.title')}
                        </h2>

                        <p className="mt-2 text-sm text-gray-600">
                            {t('providerUpgrade.description')}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                        aria-label={t('providerUpgrade.close')}
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
                                {t('providerUpgrade.privateTitle')}
                            </h3>
                        </div>

                        <p className="text-sm text-gray-600">
                            {t('providerUpgrade.privateDescription')}
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
                                {t('providerUpgrade.commercialTitle')}
                            </h3>
                        </div>

                        <p className="text-sm text-gray-600">
                            {t('providerUpgrade.commercialDescription')}
                        </p>
                    </button>
                </div>

                {/* MVP verification notice for commercial providers */}
                {providerType === 'commercial_host' && (
                    <div className="mb-6 rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
                        {t('providerUpgrade.commercialNotice')}
                    </div>
                )}

                {/* Modal actions */}
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 rounded-xl bg-gray-100 px-4 py-3 font-semibold text-gray-900 hover:bg-gray-200"
                    >
                        {t('common.cancel')}
                    </button>

                    <button
                        type="button"
                        onClick={handleConfirm}
                        disabled={isSubmitting}
                        className="flex-1 rounded-xl bg-[#5555ff] px-4 py-3 font-semibold text-white hover:bg-[#4444ee] disabled:cursor-not-allowed disabled:bg-gray-300"
                    >
                        {isSubmitting ? t('common.saving') : t('common.continue')}
                    </button>
                </div>
            </div>
        </div>
    );
}
