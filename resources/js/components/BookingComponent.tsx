import { router } from '@inertiajs/react';
import { Calendar, Clock } from 'lucide-react';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { toast } from 'sonner';

import { BookingConfirmationModal } from '@/components/BookingModal';
import { DatePicker } from '@/components/DatePicker';

type BookingDuration = 'hour' | 'half_day' | 'day' | 'week' | 'month';

// These values must match the enum values in the bookings.price_rate database column.
type BackendPriceRate = 'hour' | 'half_day' | 'day' | 'week' | 'month';

type BookingDurationOption = {
    key: BookingDuration;
    labelKey: string;
    price: number | null;
};

type DeskrlForBooking = {
    id: number;
    title?: string | { de?: string; en?: string; [key: string]: string | undefined };
    price_per_hour?: number | string | null;
    price_per_half_day?: number | string | null;
    price_per_day?: number | string | null;
    price_per_week?: number | string | null;
    price_per_month?: number | string | null;
    instant_bookable?: boolean;
};

type BookingRequestPayload = {
    deskrl_id: number;
    price_rate: BackendPriceRate;
    from: string;
    until: string;
    price: number;
};

type BookingComponentProps = {
    deskrl: DeskrlForBooking;
    spaceName: string;
    authUser: unknown;
    onGuestBooking: () => void;
};

type InertiaErrors = Record<string, string | string[] | undefined>;

// Converts price values from the backend into valid numbers.
function parsePrice(value?: number | string | null): number | null {
    if (value === null || value === undefined || value === '') {
        return null;
    }

    const numericValue = Number(value);

    return Number.isFinite(numericValue) ? numericValue : null;
}

// Maps the frontend duration selection to the backend enum value.
function mapDurationToBackendPriceRate(duration: BookingDuration): BackendPriceRate {
    const mapping: Record<BookingDuration, BackendPriceRate> = {
        hour: 'hour',
        half_day: 'half_day',
        day: 'day',
        week: 'week',
        month: 'month',
    };

    return mapping[duration];
}

// Extracts a readable error message from Inertia validation errors.
function getFirstErrorMessage(errors: InertiaErrors, fallback: string): string {
    const preferredErrorKeys = [
        'booking',
        'from',
        'until',
        'price_rate',
        'billing_address_id',
        'deskrl',
        'status',
    ];

    for (const key of preferredErrorKeys) {
        const error = errors[key];

        if (Array.isArray(error) && error.length > 0) {
            return error[0];
        }

        if (typeof error === 'string' && error.trim() !== '') {
            return error;
        }
    }

    const firstError = Object.values(errors).find(Boolean);

    if (Array.isArray(firstError) && firstError.length > 0) {
        return firstError[0];
    }

    if (typeof firstError === 'string' && firstError.trim() !== '') {
        return firstError;
    }

    return fallback;
}

export default function BookingComponent({
                                             deskrl,
                                             spaceName,
                                             authUser,
                                             onGuestBooking,
                                         }: BookingComponentProps) {
    const intl = useIntl();

    const [showBookingModal, setShowBookingModal] = useState(false);
    const [isSubmittingBookingRequest, setIsSubmittingBookingRequest] = useState(false);

    const [selectedDate, setSelectedDate] = useState('');
    const [showBookingDatePicker, setShowBookingDatePicker] = useState(false);

    const [selectedDuration, setSelectedDuration] = useState<BookingDuration>(() => {
        if (deskrl.price_per_half_day) return 'half_day';
        if (deskrl.price_per_day) return 'day';
        if (deskrl.price_per_hour) return 'hour';
        if (deskrl.price_per_week) return 'week';

        return 'month';
    });

    const [halfdayPeriod, setHalfdayPeriod] = useState<'morning' | 'afternoon'>('morning');

    const [selectedStartTime, setSelectedStartTime] = useState('09:00');
    const [selectedEndTime, setSelectedEndTime] = useState('10:00');

    const [selectedMonth, setSelectedMonth] = useState('');

    // Returns the translated text for the given translation key.
    const t = (id: string, values?: Record<string, string | number>) =>
        intl.formatMessage({ id }, values);

    const locale = intl.locale || 'de-DE';

    const bookingDurationOptions: BookingDurationOption[] = [
        {
            key: 'hour',
            labelKey: 'booking.duration.hour',
            price: parsePrice(deskrl.price_per_hour),
        },
        {
            key: 'half_day',
            labelKey: 'booking.duration.halfDay',
            price: parsePrice(deskrl.price_per_half_day),
        },
        {
            key: 'day',
            labelKey: 'booking.duration.day',
            price: parsePrice(deskrl.price_per_day),
        },
        {
            key: 'week',
            labelKey: 'booking.duration.week',
            price: parsePrice(deskrl.price_per_week),
        },
        {
            key: 'month',
            labelKey: 'booking.duration.month',
            price: parsePrice(deskrl.price_per_month),
        },
    ].filter((option): option is BookingDurationOption => option.price !== null);

    const selectedDurationOption =
        bookingDurationOptions.find((option) => option.key === selectedDuration) ?? bookingDurationOptions[0];

    const selectedBookingPrice = selectedDurationOption?.price ?? null;

    const selectedBookingLabel = selectedDurationOption
        ? t(selectedDurationOption.labelKey)
        : t('booking.duration.period');

    // Calculates the selected hourly booking duration based on start and end time.
    const getHourlyDuration = (): number => {
        const [startHour, startMinute] = selectedStartTime.split(':').map(Number);
        const [endHour, endMinute] = selectedEndTime.split(':').map(Number);

        const startTotalMinutes = startHour * 60 + startMinute;
        const endTotalMinutes = endHour * 60 + endMinute;

        return (endTotalMinutes - startTotalMinutes) / 60;
    };

    // Returns the amount used for price calculation.
    // Hourly bookings use the real time difference, all other price rates count as one selected unit.
    const getBookingDurationAmount = (): number => {
        if (selectedDuration === 'hour') {
            return getHourlyDuration();
        }

        return 1;
    };

    const bookingDurationAmount = getBookingDurationAmount();

    // Prevents negative display values before validation blocks the booking.
    const safeBookingDurationAmount = Math.max(bookingDurationAmount, 0);

    // Calculates the final booking price shown in the confirmation modal and sent to the backend.
    const calculatedBookingPrice =
        selectedBookingPrice !== null
            ? selectedBookingPrice * safeBookingDurationAmount
            : null;

    // Formats numbers for display, for example 1.5 hours if half-hour steps are used later.
    const formatDurationAmount = (amount: number): string => {
        if (Number.isInteger(amount)) {
            return amount.toString();
        }

        return amount.toLocaleString(locale, {
            minimumFractionDigits: 1,
            maximumFractionDigits: 2,
        });
    };

    // Builds the duration label displayed in the confirmation modal.
    const confirmationDurationLabel =
        selectedDuration === 'hour'
            ? `${formatDurationAmount(safeBookingDurationAmount)} ${
                safeBookingDurationAmount === 1 ? 'Stunde' : 'Stunden'
            }`
            : `1 ${selectedBookingLabel}`;

    // Builds the booking period that is sent to the backend.
    const buildBookingPeriod = (): { from: string; until: string } | null => {
        if (!selectedDate) {
            return null;
        }

        if (selectedDuration === 'hour') {
            return {
                from: `${selectedDate} ${selectedStartTime}:00`,
                until: `${selectedDate} ${selectedEndTime}:00`,
            };
        }

        if (selectedDuration === 'half_day') {
            if (halfdayPeriod === 'morning') {
                return {
                    from: `${selectedDate} 08:00:00`,
                    until: `${selectedDate} 12:00:00`,
                };
            }

            return {
                from: `${selectedDate} 13:00:00`,
                until: `${selectedDate} 17:00:00`,
            };
        }

        if (selectedDuration === 'day') {
            return {
                from: `${selectedDate} 00:00:00`,
                until: `${selectedDate} 23:59:59`,
            };
        }

        if (selectedDuration === 'week') {
            const startDate = new Date(selectedDate);
            const endDate = new Date(startDate);

            endDate.setDate(startDate.getDate() + 6);

            return {
                from: `${selectedDate} 00:00:00`,
                until: `${endDate.toISOString().split('T')[0]} 23:59:59`,
            };
        }

        if (selectedDuration === 'month') {
            if (!selectedMonth) {
                return null;
            }

            const [year, month] = selectedMonth.split('-').map(Number);
            const lastDay = new Date(year, month, 0).getDate();

            return {
                from: `${selectedMonth}-01 00:00:00`,
                until: `${selectedMonth}-${String(lastDay).padStart(2, '0')} 23:59:59`,
            };
        }

        return null;
    };

    const handleBookingClick = () => {
        if (!authUser) {
            onGuestBooking();
            return;
        }

        if (!selectedDate) {
            toast.error(t('booking.toast.selectDate'));
            return;
        }

        if (selectedBookingPrice === null) {
            toast.error(t('booking.toast.noPrice'));
            return;
        }

        // Blocks invalid hourly bookings where the end time is before or equal to the start time.
        if (selectedDuration === 'hour' && bookingDurationAmount <= 0) {
            toast.error('Die Endzeit muss nach der Startzeit liegen.');
            return;
        }

        setShowBookingModal(true);
    };

    const handleBookingConfirm = () => {
        const bookingPeriod = buildBookingPeriod();

        if (!bookingPeriod) {
            toast.error(t('booking.toast.invalidPeriod'));
            return;
        }

        if (selectedBookingPrice === null || calculatedBookingPrice === null) {
            toast.error(t('booking.toast.noPrice'));
            return;
        }

        // Blocks invalid hourly bookings again before submitting the request.
        if (selectedDuration === 'hour' && bookingDurationAmount <= 0) {
            toast.error('Die Endzeit muss nach der Startzeit liegen.');
            return;
        }

        const payload: BookingRequestPayload = {
            deskrl_id: deskrl.id,
            price_rate: mapDurationToBackendPriceRate(selectedDuration),
            from: bookingPeriod.from,
            until: bookingPeriod.until,
            price: calculatedBookingPrice,
        };

        router.post(`/deskrls/${deskrl.id}/bookings`, payload, {
            preserveScroll: true,

            onStart: () => {
                setIsSubmittingBookingRequest(true);
            },

            onSuccess: () => {
                toast.success(t('booking.toast.requestSent'));
                setShowBookingModal(false);
            },

            onError: (errors) => {
                toast.error(getFirstErrorMessage(
                    errors as InertiaErrors,
                    t('booking.toast.requestError'),
                ));
            },

            onFinish: () => {
                setIsSubmittingBookingRequest(false);
            },
        });
    };

    return (
        <>
            <aside className="lg:col-span-1">
                <div className="sticky top-8 rounded-3xl border-2 border-[#5555ff] bg-white p-6 shadow-lg">
                    <div className="mb-8">
                        {selectedBookingPrice !== null ? (
                            <div className="text-3xl font-bold text-gray-950">
                                {!selectedDate && (
                                    <span className="text-lg font-normal text-gray-600">
                                        {t('booking.price.from')}{' '}
                                    </span>
                                )}

                                €{selectedBookingPrice.toFixed(0)}

                                <span className="text-lg font-normal text-gray-600">
                                    {selectedDuration === 'week'
                                        ? ` ${t('booking.price.total')}`
                                        : ` / ${selectedBookingLabel}`}
                                </span>
                            </div>
                        ) : (
                            <p className="text-gray-500">
                                {t('booking.price.empty')}
                            </p>
                        )}
                    </div>

                    {bookingDurationOptions.length > 0 ? (
                        <div className="mb-8">
                            <label className="mb-4 block text-base font-bold text-gray-700">
                                {t('booking.duration.choose')}
                            </label>

                            <div className="grid grid-cols-3 gap-3">
                                {bookingDurationOptions.map((option) => (
                                    <button
                                        key={option.key}
                                        type="button"
                                        onClick={() => {
                                            setSelectedDuration(option.key);
                                            setShowBookingDatePicker(false);
                                        }}
                                        className={`rounded-full px-4 py-3 text-sm font-bold transition ${
                                            selectedDuration === option.key
                                                ? 'bg-[#5555ff] text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        {t(option.labelKey)}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <p className="mb-6 text-gray-500">
                            {t('booking.price.empty')}
                        </p>
                    )}

                    {selectedDuration !== 'month' ? (
                        <div className="relative mb-8">
                            <label className="mb-4 block text-base font-bold text-gray-700">
                                {selectedDuration === 'week'
                                    ? t('booking.date.startDate')
                                    : t('booking.date.date')}
                            </label>

                            <button
                                type="button"
                                onClick={() => setShowBookingDatePicker(!showBookingDatePicker)}
                                className="flex w-full items-center gap-3 rounded-3xl border border-gray-200 bg-white px-4 py-4 text-left text-gray-700 transition hover:border-[#5555ff]"
                            >
                                <Calendar className="h-5 w-5 text-gray-400" aria-hidden="true" />

                                <span className={selectedDate ? 'font-semibold text-gray-900' : 'text-gray-400'}>
                                    {selectedDate
                                        ? new Date(selectedDate).toLocaleDateString(locale, {
                                            weekday: 'short',
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric',
                                        })
                                        : t('booking.date.chooseDate')}
                                </span>
                            </button>

                            {showBookingDatePicker && (
                                <div className="absolute left-0 right-0 z-20 mt-2 rounded-2xl border border-gray-200 bg-white p-4 shadow-2xl">
                                    <DatePicker
                                        selectedDate={selectedDate}
                                        onDateSelect={(date) => {
                                            setSelectedDate(date);
                                            setShowBookingDatePicker(false);
                                        }}
                                        minDate={new Date().toISOString().split('T')[0]}
                                    />
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="mb-8">
                            <label className="mb-4 block text-base font-bold text-gray-700">
                                {t('booking.month.label')}
                            </label>

                            <select
                                value={selectedMonth}
                                onChange={(event) => {
                                    const value = event.target.value;
                                    setSelectedMonth(value);

                                    if (value) {
                                        setSelectedDate(`${value}-01`);
                                    }
                                }}
                                className="w-full rounded-3xl border border-gray-200 bg-white px-4 py-4 text-gray-700 focus:border-[#5555ff] focus:outline-none focus:ring-2 focus:ring-[#5555ff]/20"
                            >
                                <option value="">
                                    {t('booking.month.placeholder')}
                                </option>

                                {Array.from({ length: 12 }, (_, index) => {
                                    const date = new Date();
                                    date.setMonth(date.getMonth() + index);

                                    const year = date.getFullYear();
                                    const month = String(date.getMonth() + 1).padStart(2, '0');
                                    const value = `${year}-${month}`;

                                    const label = new Intl.DateTimeFormat(locale, {
                                        month: 'long',
                                        year: 'numeric',
                                    }).format(date);

                                    return (
                                        <option key={value} value={value}>
                                            {label}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                    )}

                    {selectedDuration === 'hour' && (
                        <div className="mb-8">
                            <label className="mb-4 block text-base font-bold text-gray-700">
                                {t('booking.time.label')}
                            </label>

                            <div className="grid grid-cols-2 gap-3">
                                <label className="rounded-3xl bg-gray-100 px-4 py-3">
                                    <span className="mb-1 flex items-center gap-2 text-xs font-semibold text-gray-500">
                                        <Clock className="h-4 w-4" aria-hidden="true" />
                                        {t('booking.time.from')}
                                    </span>

                                    <input
                                        type="time"
                                        value={selectedStartTime}
                                        onChange={(event) => setSelectedStartTime(event.target.value)}
                                        className="w-full bg-transparent text-base font-bold text-gray-900 outline-none"
                                    />
                                </label>

                                <label className="rounded-3xl bg-gray-100 px-4 py-3">
                                    <span className="mb-1 flex items-center gap-2 text-xs font-semibold text-gray-500">
                                        <Clock className="h-4 w-4" aria-hidden="true" />
                                        {t('booking.time.to')}
                                    </span>

                                    <input
                                        type="time"
                                        value={selectedEndTime}
                                        onChange={(event) => setSelectedEndTime(event.target.value)}
                                        className="w-full bg-transparent text-base font-bold text-gray-900 outline-none"
                                    />
                                </label>
                            </div>
                        </div>
                    )}

                    {selectedDuration === 'half_day' && (
                        <div className="mb-8">
                            <label className="mb-4 block text-base font-bold text-gray-700">
                                {t('booking.period.label')}
                            </label>

                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setHalfdayPeriod('morning');
                                        setSelectedStartTime('08:00');
                                        setSelectedEndTime('12:00');
                                    }}
                                    className={`rounded-3xl px-4 py-4 text-center transition ${
                                        halfdayPeriod === 'morning'
                                            ? 'bg-[#5555ff] text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    <span className="block text-lg font-bold">
                                        {t('booking.period.morning')}
                                    </span>

                                    <span className="mt-1 block text-sm font-semibold opacity-80">
                                        08:00 – 12:00
                                    </span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setHalfdayPeriod('afternoon');
                                        setSelectedStartTime('13:00');
                                        setSelectedEndTime('17:00');
                                    }}
                                    className={`rounded-3xl px-4 py-4 text-center transition ${
                                        halfdayPeriod === 'afternoon'
                                            ? 'bg-[#5555ff] text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    <span className="block text-lg font-bold">
                                        {t('booking.period.afternoon')}
                                    </span>

                                    <span className="mt-1 block text-sm font-semibold opacity-80">
                                        13:00 – 17:00
                                    </span>
                                </button>
                            </div>
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={handleBookingClick}
                        disabled={selectedBookingPrice === null || isSubmittingBookingRequest}
                        className={`mb-6 w-full rounded-3xl py-4 text-lg font-bold text-white transition ${
                            selectedBookingPrice === null || isSubmittingBookingRequest
                                ? 'cursor-not-allowed bg-gray-300'
                                : 'bg-[#e63cff] hover:bg-[#d12ee6]'
                        }`}
                    >
                        {deskrl.instant_bookable
                            ? t('booking.action.reserve')
                            : t('booking.action.request')}
                    </button>

                    <p className="text-center text-sm leading-5 text-gray-500">
                        {t('booking.note')}
                    </p>
                </div>
            </aside>

            <BookingConfirmationModal
                isOpen={showBookingModal}
                onClose={() => setShowBookingModal(false)}
                onConfirm={handleBookingConfirm}
                spaceName={spaceName}
                duration={selectedDuration}
                durationLabel={confirmationDurationLabel}
                price={calculatedBookingPrice ?? 0}
                date={selectedDate}
            />
        </>
    );
}
