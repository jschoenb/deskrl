import { X, CheckCircle } from 'lucide-react';
import { useIntl } from 'react-intl';

interface BookingConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    spaceName: string;
    duration: 'hour' | 'day' | 'half_day' | 'week' | 'month';
    price: number;
    date?: string;
}

const DURATION_LABEL_KEYS: Record<BookingConfirmationModalProps['duration'], string> = {
    hour: 'bookingConfirmation.duration.hour',
    day: 'bookingConfirmation.duration.day',
    half_day: 'bookingConfirmation.duration.halfDay',
    week: 'bookingConfirmation.duration.week',
    month: 'bookingConfirmation.duration.month',
};

export function BookingConfirmationModal({
                                             isOpen,
                                             onClose,
                                             onConfirm,
                                             spaceName,
                                             duration,
                                             price,
                                             date,
                                         }: BookingConfirmationModalProps) {
    const intl = useIntl();

    // Returns the translated text for the given translation key.
    const t = (id: string, values?: Record<string, string | number>) =>
        intl.formatMessage({ id }, values);

    const locale = intl.locale || 'de-DE';

    const durationText = t(DURATION_LABEL_KEYS[duration]);

    const formattedPrice = new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: 'EUR',
    }).format(price);

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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-8 relative">
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label={t('bookingConfirmation.close')}
                >
                    <X className="w-6 h-6" aria-hidden="true" />
                </button>

                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-10 h-10 text-green-600" aria-hidden="true" />
                    </div>

                    <h2 className="text-2xl mb-3" style={{ fontWeight: 700 }}>
                        {t('bookingConfirmation.title')}
                    </h2>

                    <p className="text-gray-600 leading-relaxed">
                        {t('bookingConfirmation.description')}
                    </p>
                </div>

                <div className="bg-[#f5f5ff] rounded-xl p-6 mb-6">
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
                                {t('bookingConfirmation.durationValue', { duration: durationText })}
                            </span>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-gray-300">
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
                    className="w-full bg-[#e63cff] hover:bg-[#d12ee6] text-white py-4 rounded-xl transition-colors mb-3"
                    style={{ fontWeight: 700, fontSize: '1.125rem' }}
                >
                    {t('bookingConfirmation.bookNow')}
                </button>

                <button
                    type="button"
                    onClick={onClose}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 py-3 rounded-xl transition-colors"
                    style={{ fontWeight: 600 }}
                >
                    {t('common.cancel')}
                </button>

                <p className="text-xs text-gray-500 text-center mt-4">
                    {t('bookingConfirmation.disclaimer', {
                        button: t('bookingConfirmation.bookNow'),
                    })}
                </p>
            </div>
        </div>
    );
}
