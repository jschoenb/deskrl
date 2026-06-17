import { Link, router } from '@inertiajs/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
    AlertCircle,
    Calendar,
    Check,
    CheckCircle,
    ChevronDown,
    Clock,
    MapPin,
    X,
    XCircle,
} from 'lucide-react';
import { toast } from 'sonner';

type LocalizedText =
    | string
    | {
    de?: string;
    en?: string;
    [key: string]: string | undefined;
};

type BookingStatus = 'pending' | 'confirmed' | 'cancelled';

type BookingPriceRate =
    | 'hour'
    | 'half_day'
    | 'day'
    | 'week'
    | 'month'
    | 'hourly'
    | 'daily'
    | 'weekly'
    | 'monthly';

type DisplayStatus = 'active' | 'confirmed' | 'pending' | 'past' | 'cancelled';

type StatusFilter = 'all' | DisplayStatus;

type TimeFilter = 'all' | 'today' | 'this-week' | 'this-month' | 'this-year' | 'custom';

type DeskrlImage = {
    id: number;
    path: string;
    is_main?: boolean;
    sort_order?: number;
};

type Address = {
    id?: number;
    city?: string;
    street?: string;
    house_nr?: string;
    postal_code?: string;
    state?: string | null;
};

type DeskrlAddress = {
    address?: Address;
} & Partial<Address>;

type Deskrl = {
    id: number;
    title?: LocalizedText;
    images?: DeskrlImage[];
    deskrl_address?: DeskrlAddress;
    deskrlAddress?: DeskrlAddress;
};

export type Booking = {
    id: number;
    user_id?: number;
    deskrl_id: number;
    billing_address_id?: number | null;

    from: string;
    until: string;
    booking_date?: string | null;

    price_rate?: BookingPriceRate | null;
    price?: number | string | null;

    status: BookingStatus;
    payment_status?: string | null;

    deskrl?: Deskrl | null;
};

type NormalizedBooking = {
    id: number;
    deskrlId: number;
    deskrlTitle: string;
    imageUrl: string | null;
    city: string;
    fullAddress: string;
    from: Date;
    until: Date;
    status: BookingStatus;
    displayStatus: DisplayStatus;
    priceRate: BookingPriceRate | null;
    price: number | null;
};

type BookingListProps = {
    bookings: Booking[];
};

type InertiaErrors = Record<string, string | string[] | undefined>;

function getLocalizedText(value?: LocalizedText): string {
    if (!value) return '';

    if (typeof value === 'string') {
        return value;
    }

    return value.de || value.en || Object.values(value).find(Boolean) || '';
}

function getImageUrl(path?: string): string | null {
    if (!path) return null;

    if (path.startsWith('http') || path.startsWith('/')) {
        return path;
    }

    return `/${path}`;
}

function parseDateTime(value: string): Date {
    return new Date(value.replace(' ', 'T'));
}

function parsePrice(value?: number | string | null): number | null {
    if (value === null || value === undefined || value === '') {
        return null;
    }

    const numericValue = Number(value);

    return Number.isFinite(numericValue) ? numericValue : null;
}

function formatPrice(value: number | null): string {
    if (value === null) {
        return '—';
    }

    return value.toLocaleString('de-DE', {
        minimumFractionDigits: value % 1 === 0 ? 0 : 2,
        maximumFractionDigits: 2,
    });
}

function formatDate(date: Date): string {
    return date.toLocaleDateString('de-DE', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
}

function formatTime(date: Date): string {
    return date.toLocaleTimeString('de-DE', {
        hour: '2-digit',
        minute: '2-digit',
    });
}

function formatAddress(address?: DeskrlAddress): string {
    if (!address) return 'Adresse noch nicht verfügbar';

    const resolvedAddress = address.address ?? address;

    return [
        resolvedAddress.street && resolvedAddress.house_nr
            ? `${resolvedAddress.street} ${resolvedAddress.house_nr}`
            : resolvedAddress.street,
        resolvedAddress.postal_code && resolvedAddress.city
            ? `${resolvedAddress.postal_code} ${resolvedAddress.city}`
            : resolvedAddress.city,
    ]
        .filter(Boolean)
        .join(', ') || 'Adresse noch nicht verfügbar';
}

function getCity(address?: DeskrlAddress): string {
    if (!address) return 'Ort noch nicht verfügbar';

    const resolvedAddress = address.address ?? address;

    return resolvedAddress.city || 'Ort noch nicht verfügbar';
}

function getMainImage(deskrl?: Deskrl | null): string | null {
    const image = [...(deskrl?.images ?? [])].sort(
        (a, b) => Number(b.is_main) - Number(a.is_main) || (a.sort_order ?? 0) - (b.sort_order ?? 0),
    )[0];

    return getImageUrl(image?.path);
}

function getDisplayStatus(booking: Booking): DisplayStatus {
    const now = new Date();
    const from = parseDateTime(booking.from);
    const until = parseDateTime(booking.until);

    if (booking.status === 'cancelled') {
        return 'cancelled';
    }

    if (booking.status === 'pending') {
        return 'pending';
    }

    if (until < now) {
        return 'past';
    }

    if (from <= now && until >= now) {
        return 'active';
    }

    return 'confirmed';
}

function getPriceRateLabel(priceRate?: BookingPriceRate | null): string {
    const labels: Record<BookingPriceRate, string> = {
        hour: 'Stunde',
        half_day: 'Halbtag',
        day: 'Tag',
        week: 'Woche',
        month: 'Monat',
        hourly: 'Stunde',
        daily: 'Tag',
        weekly: 'Woche',
        monthly: 'Monat',
    };

    return priceRate ? labels[priceRate] : 'Zeitraum';
}

function getStatusMeta(status: DisplayStatus) {
    if (status === 'active') {
        return {
            label: 'Aktiv',
            Icon: CheckCircle,
            className: 'bg-green-100 text-green-800',
        };
    }

    if (status === 'confirmed') {
        return {
            label: 'Bestätigt',
            Icon: CheckCircle,
            className: 'bg-blue-100 text-blue-800',
        };
    }

    if (status === 'pending') {
        return {
            label: 'Angefragt',
            Icon: AlertCircle,
            className: 'bg-yellow-100 text-yellow-800',
        };
    }

    if (status === 'past') {
        return {
            label: 'Vergangen',
            Icon: CheckCircle,
            className: 'bg-gray-100 text-gray-700',
        };
    }

    return {
        label: 'Storniert',
        Icon: XCircle,
        className: 'bg-red-100 text-red-800',
    };
}

function isInTimeRange(date: Date, timeFilter: TimeFilter, customFrom: string, customTo: string): boolean {
    if (timeFilter === 'all') return true;

    const now = new Date();

    if (timeFilter === 'today') {
        return date.toDateString() === now.toDateString();
    }

    if (timeFilter === 'this-week') {
        const start = new Date(now);
        start.setDate(now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1));
        start.setHours(0, 0, 0, 0);

        const end = new Date(start);
        end.setDate(start.getDate() + 6);
        end.setHours(23, 59, 59, 999);

        return date >= start && date <= end;
    }

    if (timeFilter === 'this-month') {
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }

    if (timeFilter === 'this-year') {
        return date.getFullYear() === now.getFullYear();
    }

    if (timeFilter === 'custom' && customFrom && customTo) {
        const from = new Date(customFrom);
        const to = new Date(customTo);
        to.setHours(23, 59, 59, 999);

        return date >= from && date <= to;
    }

    return true;
}

function getFirstErrorMessage(errors: InertiaErrors): string {
    const preferredErrorKeys = ['booking', 'status', 'from', 'until', 'price_rate'];

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

    return 'Die Aktion konnte nicht ausgeführt werden.';
}

function normalizeBooking(booking: Booking): NormalizedBooking {
    const deskrl = booking.deskrl;
    const address = deskrl?.deskrl_address ?? deskrl?.deskrlAddress;
    const from = parseDateTime(booking.from);
    const until = parseDateTime(booking.until);

    return {
        id: booking.id,
        deskrlId: booking.deskrl_id,
        deskrlTitle: getLocalizedText(deskrl?.title) || 'Deskrl ohne Titel',
        imageUrl: getMainImage(deskrl),
        city: getCity(address),
        fullAddress: formatAddress(address),
        from,
        until,
        status: booking.status,
        displayStatus: getDisplayStatus(booking),
        priceRate: booking.price_rate ?? null,
        price: parsePrice(booking.price),
    };
}

export default function BookingList({ bookings }: BookingListProps) {
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
    const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');
    const [customFrom, setCustomFrom] = useState('');
    const [customTo, setCustomTo] = useState('');
    const [filterOpen, setFilterOpen] = useState(false);
    const [cancellingBookingId, setCancellingBookingId] = useState<number | null>(null);

    const filterRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
                setFilterOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const normalizedBookings = useMemo<NormalizedBooking[]>(() => {
        return bookings.map(normalizeBooking);
    }, [bookings]);

    const filteredBookings = useMemo(() => {
        return normalizedBookings.filter(booking => {
            const statusMatches = statusFilter === 'all' || booking.displayStatus === statusFilter;
            const timeMatches = isInTimeRange(booking.from, timeFilter, customFrom, customTo);

            return statusMatches && timeMatches;
        });
    }, [normalizedBookings, statusFilter, timeFilter, customFrom, customTo]);

    const statusFilters: { key: StatusFilter; label: string }[] = [
        { key: 'all', label: 'Alle' },
        { key: 'active', label: 'Aktiv' },
        { key: 'confirmed', label: 'Bestätigt' },
        { key: 'pending', label: 'Angefragt' },
        { key: 'past', label: 'Vergangen' },
        { key: 'cancelled', label: 'Storniert' },
    ];

    const timeLabels: Record<TimeFilter, string> = {
        all: 'Alle',
        today: 'Heute',
        'this-week': 'Diese Woche',
        'this-month': 'Diesen Monat',
        'this-year': 'Dieses Jahr',
        custom: 'Benutzerdefiniert',
    };

    const isTimeFilterActive = timeFilter !== 'all';

    const timeFilterLabel =
        timeFilter === 'custom' && customFrom && customTo
            ? `${customFrom} – ${customTo}`
            : isTimeFilterActive
                ? timeLabels[timeFilter]
                : 'Zeitraum';

    const handleCancelBooking = (booking: NormalizedBooking) => {
        const confirmationMessage =
            booking.displayStatus === 'pending'
                ? 'Möchtest du diese Buchungsanfrage wirklich zurückziehen?'
                : 'Möchtest du diese Buchung wirklich stornieren?';

        if (!window.confirm(confirmationMessage)) {
            return;
        }

        router.patch(
            `/bookings/${booking.id}/cancel`,
            {},
            {
                preserveScroll: true,

                onStart: () => {
                    setCancellingBookingId(booking.id);
                },

                onSuccess: () => {
                    toast.success(
                        booking.displayStatus === 'pending'
                            ? 'Buchungsanfrage wurde zurückgezogen.'
                            : 'Buchung wurde storniert.',
                    );
                },

                onError: errors => {
                    toast.error(getFirstErrorMessage(errors as InertiaErrors));
                },

                onFinish: () => {
                    setCancellingBookingId(null);
                },
            },
        );
    };

    return (
        <>
            {/* Status filters */}
            <div className="mb-4 flex flex-wrap gap-3">
                {statusFilters.map(filter => (
                    <button
                        key={filter.key}
                        type="button"
                        onClick={() => setStatusFilter(filter.key)}
                        className={`rounded-xl px-6 py-3 font-semibold transition-all ${
                            statusFilter === filter.key
                                ? 'bg-[#5555ff] text-white shadow-lg'
                                : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        {filter.label}
                    </button>
                ))}
            </div>

            {/* Time filter */}
            <div className="mb-8 flex items-center gap-3" ref={filterRef}>
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setFilterOpen(open => !open)}
                        className={`flex items-center gap-2 rounded-xl border-2 px-4 py-2.5 text-sm font-semibold transition-all ${
                            isTimeFilterActive
                                ? 'border-[#5555ff] bg-[#5555ff] text-white shadow-md'
                                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        <Calendar className="h-4 w-4" />
                        {timeFilterLabel}
                        <ChevronDown className={`h-4 w-4 transition-transform ${filterOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {filterOpen && (
                        <div className="absolute left-0 top-full z-30 mt-2 w-64 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
                            <div className="p-2">
                                {(['all', 'today', 'this-week', 'this-month', 'this-year', 'custom'] as const).map(
                                    option => (
                                        <button
                                            key={option}
                                            type="button"
                                            onClick={() => {
                                                setTimeFilter(option);

                                                if (option !== 'custom') {
                                                    setFilterOpen(false);
                                                }
                                            }}
                                            className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm transition-colors ${
                                                timeFilter === option
                                                    ? 'bg-[#5555ff]/10 font-bold text-[#5555ff]'
                                                    : 'font-medium text-gray-700 hover:bg-gray-50'
                                            }`}
                                        >
                                            {timeLabels[option]}
                                            {timeFilter === option && <Check className="h-4 w-4" />}
                                        </button>
                                    ),
                                )}
                            </div>

                            {timeFilter === 'custom' && (
                                <div className="space-y-2 border-t border-gray-100 px-3 pb-3 pt-3">
                                    <input
                                        type="date"
                                        value={customFrom}
                                        onChange={event => setCustomFrom(event.target.value)}
                                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5555ff]"
                                    />

                                    <input
                                        type="date"
                                        value={customTo}
                                        min={customFrom}
                                        onChange={event => {
                                            setCustomTo(event.target.value);

                                            if (customFrom && event.target.value) {
                                                setFilterOpen(false);
                                            }
                                        }}
                                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5555ff]"
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {isTimeFilterActive && (
                    <button
                        type="button"
                        onClick={() => {
                            setTimeFilter('all');
                            setCustomFrom('');
                            setCustomTo('');
                        }}
                        className="flex items-center gap-1 text-sm font-medium text-gray-500 transition-colors hover:text-gray-700"
                    >
                        <X className="h-3.5 w-3.5" />
                        Zurücksetzen
                    </button>
                )}
            </div>

            {/* Bookings list */}
            <div className="space-y-6">
                {filteredBookings.length === 0 ? (
                    <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
                        <XCircle className="mx-auto mb-4 h-16 w-16 text-gray-300" />

                        <h3 className="mb-2 text-xl font-bold text-gray-950">
                            Keine Buchungen gefunden
                        </h3>

                        <p className="mb-6 text-gray-600">
                            Für die gewählten Filter gibt es aktuell keine Buchungen.
                        </p>

                        <Link
                            href="/"
                            className="inline-block rounded-xl bg-[#5555ff] px-8 py-3 font-semibold text-white transition-colors hover:bg-[#4444ee]"
                        >
                            Deskrls entdecken
                        </Link>
                    </div>
                ) : (
                    filteredBookings.map(booking => {
                        const statusMeta = getStatusMeta(booking.displayStatus);
                        const StatusIcon = statusMeta.Icon;

                        const canCancel =
                            booking.displayStatus === 'active' ||
                            booking.displayStatus === 'confirmed' ||
                            booking.displayStatus === 'pending';

                        return (
                            <div
                                key={booking.id}
                                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
                            >
                                <div className="grid gap-6 p-6 md:grid-cols-4">
                                    {/* Image */}
                                    <div className="md:col-span-1">
                                        <Link href={`/deskrls/${booking.deskrlId}`} className="block">
                                            <div className="relative flex h-48 items-center justify-center overflow-hidden rounded-xl bg-gray-100 transition-opacity hover:opacity-90 md:h-full">
                                                {booking.imageUrl ? (
                                                    <img
                                                        src={booking.imageUrl}
                                                        alt={booking.deskrlTitle}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <span className="px-4 text-center text-sm font-semibold text-gray-400">
                                                        Kein Bild vorhanden
                                                    </span>
                                                )}
                                            </div>
                                        </Link>
                                    </div>

                                    {/* Details */}
                                    <div className="space-y-4 md:col-span-2">
                                        <div>
                                            <div className="mb-2 flex items-start justify-between gap-3">
                                                <Link
                                                    href={`/deskrls/${booking.deskrlId}`}
                                                    className="block flex-1 transition-opacity hover:opacity-80"
                                                >
                                                    <h3 className="text-2xl font-bold text-gray-950">
                                                        {booking.deskrlTitle}
                                                    </h3>
                                                </Link>

                                                <span
                                                    className={`inline-flex shrink-0 items-center gap-1 rounded-lg px-3 py-1 text-sm font-semibold ${statusMeta.className}`}
                                                >
                                                    <StatusIcon className="h-4 w-4" />
                                                    {statusMeta.label}
                                                </span>
                                            </div>

                                            <p className="flex items-center gap-2 text-gray-600">
                                                <MapPin className="h-4 w-4 shrink-0" />
                                                {booking.city}
                                            </p>

                                            {(booking.displayStatus === 'active' ||
                                                booking.displayStatus === 'confirmed') && (
                                                <div className="mt-2 flex items-start gap-2 rounded-xl border border-[#5555ff]/20 bg-[#5555ff]/5 px-3 py-2">
                                                    <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#5555ff]" />

                                                    <div>
                                                        <p className="mb-0.5 text-xs font-bold text-[#5555ff]">
                                                            Vollständige Adresse
                                                        </p>

                                                        <p className="text-sm font-semibold text-gray-800">
                                                            {booking.fullAddress}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="flex items-start gap-3 rounded-xl bg-gray-50 p-4">
                                                <Calendar className="mt-0.5 h-5 w-5 text-[#5555ff]" />

                                                <div>
                                                    <p className="mb-1 text-sm text-gray-600">
                                                        Von
                                                    </p>

                                                    <p className="font-semibold">
                                                        {formatDate(booking.from)}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3 rounded-xl bg-gray-50 p-4">
                                                <Clock className="mt-0.5 h-5 w-5 text-[#5555ff]" />

                                                <div>
                                                    <p className="mb-1 text-sm text-gray-600">
                                                        Uhrzeit
                                                    </p>

                                                    <p className="font-semibold">
                                                        {formatTime(booking.from)}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3 rounded-xl bg-gray-50 p-4">
                                                <Calendar className="mt-0.5 h-5 w-5 text-[#5555ff]" />

                                                <div>
                                                    <p className="mb-1 text-sm text-gray-600">
                                                        Bis
                                                    </p>

                                                    <p className="font-semibold">
                                                        {formatDate(booking.until)}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3 rounded-xl bg-gray-50 p-4">
                                                <Clock className="mt-0.5 h-5 w-5 text-[#5555ff]" />

                                                <div>
                                                    <p className="mb-1 text-sm text-gray-600">
                                                        Uhrzeit
                                                    </p>

                                                    <p className="font-semibold">
                                                        {formatTime(booking.until)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-4 border-t border-gray-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
                                            <div>
                                                <p className="text-sm text-gray-600">
                                                    Gesamtpreis
                                                </p>

                                                <p className="text-2xl font-bold text-[#5555ff]">
                                                    €{formatPrice(booking.price)}
                                                </p>

                                                <p className="mt-1 text-xs text-gray-500">
                                                    Rate: {getPriceRateLabel(booking.priceRate)}
                                                </p>
                                            </div>

                                            {/* Mobile actions */}
                                            <div className="flex gap-2 md:hidden">
                                                <Link
                                                    href={`/bookings/${booking.id}`}
                                                    className="flex-1 rounded-lg bg-gray-100 px-3 py-2 text-center text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-200"
                                                >
                                                    Details
                                                </Link>

                                                {canCancel && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleCancelBooking(booking)}
                                                        disabled={cancellingBookingId === booking.id}
                                                        className="flex-1 rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                                                    >
                                                        {booking.displayStatus === 'pending'
                                                            ? 'Zurückziehen'
                                                            : 'Stornieren'}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Desktop actions */}
                                    <div className="hidden flex-col gap-2 md:col-span-1 md:flex">
                                        <Link
                                            href={`/bookings/${booking.id}`}
                                            className="w-full rounded-lg bg-[#5555ff] px-3 py-2 text-center text-sm font-semibold text-white transition-colors hover:bg-[#4444ee]"
                                        >
                                            Details ansehen
                                        </Link>

                                        <Link
                                            href={`/deskrls/${booking.deskrlId}`}
                                            className="w-full rounded-lg bg-gray-100 px-3 py-2 text-center text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-200"
                                        >
                                            Deskrl ansehen
                                        </Link>

                                        {canCancel && (
                                            <button
                                                type="button"
                                                onClick={() => handleCancelBooking(booking)}
                                                disabled={cancellingBookingId === booking.id}
                                                className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                                            >
                                                <X className="h-4 w-4" />
                                                {booking.displayStatus === 'pending'
                                                    ? 'Anfrage zurückziehen'
                                                    : 'Buchung stornieren'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </>
    );
}
