import { CheckCircle, X } from 'lucide-react';
import { useIntl } from 'react-intl';

interface BookingConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    spaceName: string;
    duration: 'hour' | 'day' | 'half_day' | 'week' | 'month';
    durationLabel: string;
    price: number;
    date?: string;
}

export function BookingConfirmationModal({
                                             isOpen,
                                             onClose,
                                             onConfirm,
                                             spaceName,
                                             durationLabel,
                                             price,
                                             date,
                                         }: BookingConfirmationModalProps) {
    const intl = useIntl();

    // Returns the translated text for the given translation key.
    const t = (id: string, values?: Record<string, string | number>) =>
        intl.formatMessage({ id }, values);

    const locale = intl.locale || 'de-DE';

    // Formats the calculated total price for the selected locale.
    const formattedPrice = new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: 'EUR',
    }).format(price);

    // Formats the selected booking date for the confirmation view.
    const formattedDate = date
        ? new Date(date).toLocaleDateString(locale, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })
        : '';

    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="relative w-full max-w-lg rounded-2xl bg-white p-8">
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-6 right-6 text-gray-400 transition-colors hover:text-gray-600"
                    aria-label={t('bookingConfirmation.close')}
                >
                    <X className="h-6 w-6" aria-hidden="true" />
                </button>

                <div className="mb-6 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                        <CheckCircle className="h-10 w-10 text-green-600" aria-hidden="true" />
                    </div>

                    <h2 className="mb-3 text-2xl" style={{ fontWeight: 700 }}>
                        {t('bookingConfirmation.title')}
                    </h2>

                    <p className="leading-relaxed text-gray-600">
                        {t('bookingConfirmation.description')}
                    </p>
                </div>

                <div className="mb-6 rounded-xl bg-[#f5f5ff] p-6">
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-700">
                                {t('bookingConfirmation.space')}
                            </span>

                            <span style={{ fontWeight: 600 }}>
                                {spaceName}
                            </span>
                        </div>

                        {date && (
                            <div className="flex items-center justify-between">
                                <span className="text-gray-700">
                                    {t('bookingConfirmation.date')}
                                </span>

                                <span style={{ fontWeight: 600 }}>
                                    {formattedDate}
                                </span>
                            </div>
                        )}

                        <div className="flex items-center justify-between">
                            <span className="text-gray-700">
                                {t('bookingConfirmation.duration')}
                            </span>

                            <span style={{ fontWeight: 600 }}>
                                {durationLabel}
                            </span>
                        </div>

                        <div className="flex items-center justify-between border-t border-gray-300 pt-3">
                            <span className="text-gray-900" style={{ fontWeight: 700 }}>
                                {t('bookingConfirmation.totalPrice')}
                            </span>

                            <span className="text-2xl text-[#5555ff]" style={{ fontWeight: 700 }}>
                                {formattedPrice}
                            </span>
                        </div>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={onConfirm}
                    className="mb-3 w-full rounded-xl bg-[#e63cff] py-4 text-white transition-colors hover:bg-[#d12ee6]"
                    style={{ fontWeight: 700, fontSize: '1.125rem' }}
                >
                    {t('bookingConfirmation.bookNow')}
                </button>

                <button
                    type="button"
                    onClick={onClose}
                    className="w-full rounded-xl bg-gray-100 py-3 text-gray-900 transition-colors hover:bg-gray-200"
                    style={{ fontWeight: 600 }}
                >
                    {t('common.cancel')}
                </button>

                <p className="mt-4 text-center text-xs text-gray-500">
                    {t('bookingConfirmation.disclaimer', {
                        button: t('bookingConfirmation.bookNow'),
                    })}
                </p>
            </div>
        </div>
    );
}
