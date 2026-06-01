import { Link, router, usePage } from '@inertiajs/react';
import React, { ReactNode, useMemo, useState } from 'react';
import {
    ArrowLeft,
    Bike,
    Building2,
    Calendar,
    Check,
    Clock,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Coffee,
    Heart,
    Mail,
    MapPin,
    MessageCircle,
    Monitor,
    Navigation,
    Share2,
    Users,
    X,
} from 'lucide-react';
import { toast } from 'sonner';
import { DatePicker } from '@/components/DatePicker';
import AuthModal from '@/components/AuthModal';
import { BookingConfirmationModal } from '@/components/BookingModal';
import AppLayout from '@/Layouts/AppLayout';

/**
 * Localized fields can either be plain strings or translation objects.
 * Example: { de: "Meetingraum", en: "Meeting room" }
 */
type LocalizedText =
    | string
    | {
    de?: string;
    en?: string;
    [key: string]: string | undefined;
};

/**
 * Image object as returned by the Laravel backend.
 */
type DeskrlImage = {
    id: number;
    path: string;
    is_main?: boolean;
    sort_order?: number;
};

/**
 * Category object of a Deskrl, e.g. workplace, meeting room or seminar room.
 */
type DeskrlCategory = {
    id: number;
    name: string;
    mask_type?: string;
};

/**
 * Utility category object, e.g. technology, comfort or mobility.
 */
type UtilityCategory = {
    id: number;
    category_name: LocalizedText;
};

/**
 * Utility object, e.g. WiFi, projector or parking.
 */
type Utility = {
    id: number;
    name: LocalizedText;

    // Laravel usually serializes nested relations as snake_case.
    utility_category?: UtilityCategory;

    // This fallback is kept in case the data is transformed later.
    utilityCategory?: UtilityCategory;

    pivot?: {
        quantity?: number | null;
    };
};

/**
 * Address object connected through deskrl_address.address.
 */
type Address = {
    id: number;
    city?: string;
    street?: string;
    house_nr?: string;
    postal_code?: string;
    state?: string | null;
};

/**
 * Wrapper relation between Deskrl and Address.
 */
type DeskrlAddress = {
    address?: Address;
};

/**
 * Commercial account data connected to a host account.
 * The verification status is used to display the verified host badge.
 */
type CommercialAccount = {
    id: number;
    company_name?: string;
    is_verified?: boolean;
};

/**
 * Host account object.
 */
type HostAccount = {
    id: number;
    first_name?: string;
    last_name?: string;
    profile_image?: string | null;

    // Laravel usually serializes the commercialAccount relation as snake_case.
    commercial_account?: CommercialAccount;

    // Fallback in case the relation is transformed to camelCase later.
    commercialAccount?: CommercialAccount;
};

/**
 * Main Deskrl type expected from the Inertia backend prop.
 */
type Deskrl = {
    id: number;
    title?: LocalizedText;
    description?: LocalizedText;
    capacity?: number | null;

    price_per_hour?: number | string | null;
    price_per_half_day?: number | string | null;
    price_per_day?: number | string | null;
    price_per_week?: number | string | null;
    price_per_month?: number | string | null;

    instant_bookable?: boolean;

    // Laravel JSON serialization usually returns snake_case relation names.
    deskrl_category?: DeskrlCategory;
    deskrl_address?: DeskrlAddress;
    host_account?: HostAccount;

    // CamelCase fallbacks are kept for possible frontend transformations.
    deskrlCategory?: DeskrlCategory;
    deskrlAddress?: DeskrlAddress;
    hostAccount?: HostAccount;

    images?: DeskrlImage[];
    utilities?: Utility[];
};

type Props = {
    deskrl: Deskrl;
};

/**
 * Expected shared Inertia props.
 * The auth.user object must be provided from HandleInertiaRequests.php.
 */
type PageProps = {
    auth?: {
        user?: {
            id: number;
            first_name?: string;
            last_name?: string;
            email?: string;
        } | null;
    };
};

/**
 * Frontend/UI duration values.
 *
 * These values are used inside the React component and by the BookingConfirmationModal.
 */
type BookingDuration = 'hour' | 'half_day' | 'day' | 'week' | 'month';

/**
 * Backend enum values for bookings.price_rate.
 *
 * These values must match the Laravel validation and database enum.
 */
type BackendPriceRate = 'hourly' | 'half_day' | 'daily' | 'weekly' | 'monthly';

type BookingDurationOption = {
    key: BookingDuration;
    label: string;
    price: number | null;
};

/**
 * Payload sent to the Laravel BookingController.
 */
type BookingRequestPayload = {
    deskrl_id: number;
    price_rate: BackendPriceRate;
    from: string;
    until: string;
    price: number;
};

/**
 * Returns the best available text from a localized field.
 * It first tries German, then English, then any other existing value.
 */
function getLocalizedText(value?: LocalizedText): string {
    if (!value) return '';

    if (typeof value === 'string') {
        return value;
    }

    return value.de || value.en || Object.values(value).find(Boolean) || '';
}

/**
 * Converts backend image paths into browser-safe URLs.
 * External URLs are returned unchanged.
 */
function getImageUrl(path: string): string {
    if (path.startsWith('http') || path.startsWith('/')) {
        return path;
    }

    return `/${path}`;
}

/**
 * Converts backend price values into numbers for the booking widget.
 */
function parsePrice(value?: number | string | null): number | null {
    if (value === null || value === undefined || value === '') {
        return null;
    }

    const numericValue = Number(value);

    return Number.isFinite(numericValue) ? numericValue : null;
}

/**
 * Builds a readable address string from the nested Deskrl address relation.
 */
function formatAddress(address?: Address): string {
    if (!address) return 'Adresse noch nicht verfügbar';

    return [
        address.street && address.house_nr ? `${address.street} ${address.house_nr}` : address.street,
        address.postal_code && address.city ? `${address.postal_code} ${address.city}` : address.city,
    ]
        .filter(Boolean)
        .join(', ');
}

/**
 * Returns an icon for a utility category based on its localized category name.
 * This is a temporary UI mapping until category icons are stored in the database.
 */
function getUtilityCategoryIcon(categoryName: string) {
    const normalizedName = categoryName.toLowerCase();

    if (normalizedName.includes('technik') || normalizedName.includes('technology')) {
        return Monitor;
    }

    if (normalizedName.includes('komfort') || normalizedName.includes('comfort')) {
        return Coffee;
    }

    if (normalizedName.includes('mobilität') || normalizedName.includes('mobility')) {
        return Bike;
    }

    return Building2;
}

/**
 * Returns an icon for a single utility based on its name.
 * This is a temporary UI mapping until utility icons are stored in the database.
 */
function getUtilityIcon(utilityName: string) {
    const normalizedName = utilityName.toLowerCase();

    if (
        normalizedName.includes('parkplatz') ||
        normalizedName.includes('parking') ||
        normalizedName.includes('lage') ||
        normalizedName.includes('location')
    ) {
        return MapPin;
    }

    if (
        normalizedName.includes('fahrrad') ||
        normalizedName.includes('bike') ||
        normalizedName.includes('e-bike')
    ) {
        return Bike;
    }

    if (
        normalizedName.includes('beamer') ||
        normalizedName.includes('bildschirm') ||
        normalizedName.includes('screen') ||
        normalizedName.includes('monitor')
    ) {
        return Monitor;
    }

    if (
        normalizedName.includes('kaffee') ||
        normalizedName.includes('coffee') ||
        normalizedName.includes('küche') ||
        normalizedName.includes('kitchen')
    ) {
        return Coffee;
    }

    return Check;
}

/**
 * Maps the frontend duration value to the backend enum value stored in bookings.price_rate.
 *
 * Frontend/UI:
 * - hour
 * - half_day
 * - day
 * - week
 * - month
 *
 * Backend/database:
 * - hourly
 * - half_day
 * - daily
 * - weekly
 * - monthly
 */
function mapDurationToBackendPriceRate(duration: BookingDuration): BackendPriceRate {
    const mapping: Record<BookingDuration, BackendPriceRate> = {
        hour: 'hourly',
        half_day: 'half_day',
        day: 'daily',
        week: 'weekly',
        month: 'monthly',
    };

    return mapping[duration];
}

export default function Show({ deskrl }: Props) {
    const { props } = usePage<PageProps>();
    const authUser = props.auth?.user ?? null;

    /**
     * Stores the currently selected image index for gallery and lightbox.
     */
    const [selectedImage, setSelectedImage] = useState(0);

    /**
     * Controls whether the fullscreen image lightbox is open.
     */
    const [lightboxOpen, setLightboxOpen] = useState(false);

    /**
     * Controls whether the share dropdown menu is visible.
     */
    const [showShareMenu, setShowShareMenu] = useState(false);

    /**
     * Controls whether the authentication modal is visible.
     * This is opened when a guest tries to start the booking flow.
     */
    const [showAuthModal, setShowAuthModal] = useState(false);

    /**
     * Controls whether the booking confirmation modal is visible.
     * This is opened when an authenticated user starts the booking flow.
     */
    const [showBookingModal, setShowBookingModal] = useState(false);

    /**
     * Tracks whether the booking request POST is currently running.
     * This prevents duplicate submissions.
     */
    const [isSubmittingBookingRequest, setIsSubmittingBookingRequest] = useState(false);

    /**
     * Stores the selected date from the booking widget.
     */
    const [selectedDate, setSelectedDate] = useState('');

    /**
     * Stores the currently selected booking duration in the sidebar.
     */
    const [selectedDuration, setSelectedDuration] = useState<BookingDuration>(() => {
        if (deskrl.price_per_half_day) return 'half_day';
        if (deskrl.price_per_day) return 'day';
        if (deskrl.price_per_hour) return 'hour';
        if (deskrl.price_per_week) return 'week';
        return 'month';
    });

    /**
     * Controls the date picker dropdown inside the booking widget.
     */
    const [showBookingDatePicker, setShowBookingDatePicker] = useState(false);

    /**
     * Stores the selected half-day period.
     *
     * This value is not sent directly to the backend.
     * It is only used to build from/until:
     * - morning   => 08:00 to 12:00
     * - afternoon => 13:00 to 17:00
     */
    const [halfdayPeriod, setHalfdayPeriod] = useState<'morning' | 'afternoon'>('morning');

    /**
     * Stores optional start and end times for hourly bookings.
     */
    const [selectedStartTime, setSelectedStartTime] = useState('09:00');
    const [selectedEndTime, setSelectedEndTime] = useState('10:00');

    /**
     * Stores the selected month for monthly bookings.
     */
    const [selectedMonth, setSelectedMonth] = useState('');

    /**
     * Controls whether all utility groups are shown.
     * By default, only the first groups are displayed to keep the page compact.
     */
    const [showAllUtilities, setShowAllUtilities] = useState(false);

    /**
     * Tracks whether the host profile image failed to load.
     * If it fails, the UI falls back to initials.
     */
    const [hostImageFailed, setHostImageFailed] = useState(false);

    /**
     * Support both snake_case and camelCase relation names.
     * Snake_case is expected from Laravel JSON serialization.
     */
    const category = deskrl.deskrl_category || deskrl.deskrlCategory;
    const address = deskrl.deskrl_address?.address || deskrl.deskrlAddress?.address;
    const host = deskrl.host_account || deskrl.hostAccount;

    /**
     * Reads the real verification status from the host's commercial account.
     * If no commercial account exists, the host is treated as not verified.
     */
    const commercialAccount = host?.commercial_account || host?.commercialAccount;
    const isHostVerified = commercialAccount?.is_verified === true;

    /**
     * Convert localized JSON fields into simple display strings.
     */
    const title = getLocalizedText(deskrl.title) || 'Deskrl ohne Titel';
    const description = getLocalizedText(deskrl.description) || 'Für diesen Deskrl gibt es noch keine Beschreibung.';

    /**
     * Sort images so that the main image appears first.
     * No placeholder images are used on purpose, so missing backend images become visible during development.
     */
    const images = useMemo(() => {
        return (
            deskrl.images
                ?.sort((a, b) => Number(b.is_main) - Number(a.is_main) || (a.sort_order ?? 0) - (b.sort_order ?? 0))
                .map(image => getImageUrl(image.path)) ?? []
        );
    }, [deskrl.images]);

    /**
     * Build a list of available booking durations.
     * Empty prices are filtered out so only bookable durations are displayed.
     */
    const bookingDurationOptions: BookingDurationOption[] = [
        {
            key: 'hour',
            label: 'Stunde',
            price: parsePrice(deskrl.price_per_hour),
        },
        {
            key: 'half_day',
            label: 'Halbtag',
            price: parsePrice(deskrl.price_per_half_day),
        },
        {
            key: 'day',
            label: 'Tag',
            price: parsePrice(deskrl.price_per_day),
        },
        {
            key: 'week',
            label: 'Woche',
            price: parsePrice(deskrl.price_per_week),
        },
        {
            key: 'month',
            label: 'Monat',
            price: parsePrice(deskrl.price_per_month),
        },
    ].filter((option): option is BookingDurationOption => option.price !== null);

    const selectedDurationOption =
        bookingDurationOptions.find(option => option.key === selectedDuration) ?? bookingDurationOptions[0];

    const selectedBookingPrice = selectedDurationOption?.price ?? null;
    const selectedBookingLabel = selectedDurationOption?.label ?? 'Zeitraum';

    /**
     * Group utilities by their utility category.
     * This allows the detail page to display equipment like in the Figma prototype.
     */
    const groupedUtilities = useMemo(() => {
        const groups: Record<string, Utility[]> = {};

        deskrl.utilities?.forEach(utility => {
            const utilityCategory = utility.utility_category || utility.utilityCategory;
            const categoryName = getLocalizedText(utilityCategory?.category_name) || 'Weitere Ausstattung';

            if (!groups[categoryName]) {
                groups[categoryName] = [];
            }

            groups[categoryName].push(utility);
        });

        return Object.entries(groups).map(([categoryName, utilities]) => ({
            categoryName,
            utilities,
            Icon: getUtilityCategoryIcon(categoryName),
        }));
    }, [deskrl.utilities]);

    /**
     * Only show the first utility groups by default.
     * The button below expands the full list.
     */
    const visibleUtilityGroups = showAllUtilities ? groupedUtilities : groupedUtilities.slice(0, 3);

    /**
     * Build the actual database period from the frontend selection.
     *
     * Important:
     * The database does not store "morning" or "afternoon".
     * For half-day bookings, the exact slot is encoded through from/until.
     */
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

            // Current simplified MVP logic:
            // A week booking covers 7 calendar days starting from selectedDate.
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

    /**
     * Handles share actions without requiring backend logic.
     */
    const handleShare = (type: 'copy' | 'email' | 'whatsapp') => {
        const url = window.location.href;

        if (type === 'copy') {
            navigator.clipboard.writeText(url);
            toast.success('Link wurde kopiert.');
            setShowShareMenu(false);
            return;
        }

        if (type === 'email') {
            window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`;
            return;
        }

        if (type === 'whatsapp') {
            window.open(`https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`, '_blank');
        }
    };

    /**
     * Opens the authentication modal for guests.
     * Opens the booking modal for authenticated users.
     */
    const handleBookingClick = () => {
        if (!authUser) {
            setShowAuthModal(true);
            return;
        }

        if (!selectedDate) {
            toast.error('Bitte wähle zuerst ein Datum aus.');
            return;
        }

        if (selectedBookingPrice === null) {
            toast.error('Für diesen Zeitraum ist kein Preis hinterlegt.');
            return;
        }

        setShowBookingModal(true);
    };

    /**
     * Sends the booking request to Laravel.
     *
     * This does not handle payment.
     * The expected backend behavior is:
     * - user_id is taken from Auth::id()
     * - deskrl_id is taken from route-model binding
     * - host assignment is indirect through deskrls.host_account_id
     * - status should be saved as pending or confirmed depending on instant_bookable
     * - payment_status should be saved as unpaid
     */
    const handleBookingConfirm = () => {
        const bookingPeriod = buildBookingPeriod();

        if (!bookingPeriod) {
            toast.error('Bitte wähle zuerst einen gültigen Zeitraum aus.');
            return;
        }

        if (selectedBookingPrice === null) {
            toast.error('Für diesen Zeitraum ist kein Preis hinterlegt.');
            return;
        }

        const payload: BookingRequestPayload = {
            deskrl_id: deskrl.id,
            price_rate: mapDurationToBackendPriceRate(selectedDuration),
            from: bookingPeriod.from,
            until: bookingPeriod.until,
            price: selectedBookingPrice,
        };

        router.post(`/deskrls/${deskrl.id}/bookings`, payload, {
            preserveScroll: true,

            onStart: () => {
                setIsSubmittingBookingRequest(true);
            },

            onSuccess: () => {
                toast.success('Buchungsanfrage wurde gesendet.');
                setShowBookingModal(false);
            },

            onError: () => {
                toast.error('Die Buchungsanfrage konnte nicht gesendet werden.');
            },

            onFinish: () => {
                setIsSubmittingBookingRequest(false);
            },
        });
    };

    /**
     * Placeholder handler for favorites.
     * Later this can call the FavoriteController through Inertia.
     */
    const handleFavoriteClick = () => {
        toast.info('Favoriten-Funktion wird später angebunden.');
    };

    /**
     * Opens route planning in Google Maps.
     */
    const handleRoutePlanning = () => {
        window.open(
            `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(formatAddress(address))}`,
            '_blank',
        );
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Fullscreen image lightbox */}
            {lightboxOpen && images.length > 0 && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
                    <button
                        type="button"
                        onClick={() => setLightboxOpen(false)}
                        className="absolute right-6 top-6 text-white hover:text-gray-300"
                        aria-label="Lightbox schließen"
                    >
                        <X className="h-8 w-8" />
                    </button>

                    <button
                        type="button"
                        onClick={() => setSelectedImage((selectedImage - 1 + images.length) % images.length)}
                        className="absolute left-6 text-white hover:text-gray-300"
                        aria-label="Vorheriges Bild"
                    >
                        <ChevronLeft className="h-12 w-12" />
                    </button>

                    <img
                        src={images[selectedImage]}
                        alt={title}
                        className="max-h-[90vh] max-w-[90vw] object-contain"
                    />

                    <button
                        type="button"
                        onClick={() => setSelectedImage((selectedImage + 1) % images.length)}
                        className="absolute right-6 text-white hover:text-gray-300"
                        aria-label="Nächstes Bild"
                    >
                        <ChevronRight className="h-12 w-12" />
                    </button>

                    <div className="absolute bottom-6 text-lg text-white">
                        {selectedImage + 1} / {images.length}
                    </div>
                </div>
            )}

            <div className="mx-auto max-w-7xl px-4 py-8">
                {/* Back link to overview/search page */}
                <Link href="/" className="mb-6 inline-flex items-center gap-2 text-gray-600 hover:text-[#5555ff]">
                    <ArrowLeft className="h-5 w-5" />
                    Zurück zur Suche
                </Link>

                {/* Header area with title, location and action buttons */}
                <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
                    <div>
                        {category?.name && (
                            <span className="mb-3 inline-block rounded-full bg-[#f4f3ff] px-4 py-1 text-sm font-semibold text-[#5555ff]">
                                {category.name}
                            </span>
                        )}

                        <h1 className="mb-3 text-2xl font-bold leading-tight text-gray-950 md:text-4xl">
                            {title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-4 text-gray-600">
                            <p className="flex items-center gap-2 text-base text-gray-600 md:text-lg">
                                <MapPin className="h-5 w-5 text-[#5555ff]" />
                                {address?.city || 'Ort noch nicht verfügbar'}
                            </p>
                        </div>
                    </div>

                    {/* Share and favorite buttons */}
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setShowShareMenu(!showShareMenu)}
                                className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 font-semibold hover:border-[#5555ff]"
                            >
                                <Share2 className="h-5 w-5" />
                                Teilen
                            </button>

                            {/* Share dropdown menu */}
                            {showShareMenu && (
                                <div className="absolute right-0 top-full z-10 mt-2 min-w-[200px] rounded-xl border border-gray-200 bg-white py-2 shadow-lg">
                                    <button
                                        type="button"
                                        onClick={() => handleShare('whatsapp')}
                                        className="flex w-full items-center gap-3 px-4 py-2 hover:bg-gray-50"
                                    >
                                        <MessageCircle className="h-5 w-5" />
                                        WhatsApp
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handleShare('email')}
                                        className="flex w-full items-center gap-3 px-4 py-2 hover:bg-gray-50"
                                    >
                                        <Mail className="h-5 w-5" />
                                        E-Mail
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handleShare('copy')}
                                        className="flex w-full items-center gap-3 px-4 py-2 hover:bg-gray-50"
                                    >
                                        <Share2 className="h-5 w-5" />
                                        Link kopieren
                                    </button>
                                </div>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={handleFavoriteClick}
                            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 font-semibold hover:border-[#e63cff] hover:text-[#e63cff]"
                        >
                            <Heart className="h-5 w-5" />
                            Merken
                        </button>
                    </div>
                </div>

                {/* Image gallery */}
                {images.length > 0 ? (
                    <div className="mb-10 grid h-[500px] grid-cols-4 gap-4">
                        <button
                            type="button"
                            onClick={() => {
                                setSelectedImage(0);
                                setLightboxOpen(true);
                            }}
                            className="relative col-span-4 row-span-2 overflow-hidden rounded-3xl md:col-span-2"
                        >
                            <img
                                src={images[0]}
                                alt={title}
                                className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                            />
                        </button>

                        {images.slice(1, 5).map((image, index) => (
                            <button
                                type="button"
                                key={image}
                                onClick={() => {
                                    setSelectedImage(index + 1);
                                    setLightboxOpen(true);
                                }}
                                className="relative hidden overflow-hidden rounded-3xl md:block"
                            >
                                <img
                                    src={image}
                                    alt={`${title} ${index + 2}`}
                                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                                />
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="mb-10 flex h-[360px] items-center justify-center rounded-3xl border-2 border-dashed border-red-300 bg-red-50 text-center">
                        <div>
                            <p className="text-xl font-bold text-red-700">Keine Bilder vorhanden</p>
                            <p className="mt-2 text-sm text-red-600">
                                Der Deskrl hat aktuell keine Bilder aus der Datenbank.
                            </p>
                        </div>
                    </div>
                )}

                <div className="grid gap-10 lg:grid-cols-3">
                    {/* Main content column */}
                    <div className="space-y-8 lg:col-span-2">
                        {/* Main information card: capacity, description and utilities */}
                        <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
                            {/* Capacity section like in the Figma prototype */}
                            {deskrl.capacity && (
                                <div className="border-b border-gray-200 pb-8">
                                    <div className="flex items-center gap-5">
                                        <div className="flex h-12 w-12 items-center justify-center text-[#5555ff]">
                                            <Users className="h-7 w-7" />
                                        </div>

                                        <div>
                                            <p className="text-sm text-gray-500 md:text-base">Maximale Personenzahl</p>
                                            <p className="text-xl font-bold text-gray-800">
                                                Bis zu {deskrl.capacity} Personen
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Description section */}
                            <div className="border-b border-gray-200 py-8">
                                <h2 className="mb-6 text-2xl font-bold text-gray-950">Über diesen Raum</h2>

                                <p className="text-base leading-7 text-gray-700 md:text-lg">
                                    {description}
                                </p>
                            </div>

                            {/* Utility section grouped by category */}
                            <div className="pt-8">
                                <h2 className="mb-8 text-2xl font-bold text-gray-950">Ausstattung & Services</h2>

                                {groupedUtilities.length > 0 ? (
                                    <div className="space-y-10">
                                        {visibleUtilityGroups.map(group => {
                                            const CategoryIcon = group.Icon;

                                            return (
                                                <div key={group.categoryName}>
                                                    {/* Utility category headline */}
                                                    <div className="mb-5 flex items-center gap-3">
                                                        <CategoryIcon className="h-6 w-6 text-[#5555ff]" />
                                                        <h3 className="text-lg font-bold text-gray-950 md:text-xl">
                                                            {group.categoryName}
                                                        </h3>
                                                    </div>

                                                    {/* Utility cards */}
                                                    <div className="grid gap-4 md:grid-cols-2">
                                                        {group.utilities.map(utility => {
                                                            const utilityName = getLocalizedText(utility.name);
                                                            const UtilityIcon = getUtilityIcon(utilityName);

                                                            return (
                                                                <div
                                                                    key={utility.id}
                                                                    className="flex items-center gap-4 rounded-2xl bg-[#f4f3ff] px-4 py-4"
                                                                >
                                                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#5555ff] text-white">
                                                                        <UtilityIcon className="h-5 w-5" />
                                                                    </div>

                                                                    <span className="text-base font-semibold text-gray-950 md:text-lg">
                                                                        {utilityName}
                                                                        {utility.pivot?.quantity ? ` (${utility.pivot.quantity})` : ''}
                                                                    </span>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            );
                                        })}

                                        {/* Expand button for additional utility groups */}
                                        {groupedUtilities.length > 3 && (
                                            <div className="flex justify-center">
                                                <button
                                                    type="button"
                                                    onClick={() => setShowAllUtilities(!showAllUtilities)}
                                                    className="inline-flex items-center gap-3 rounded-3xl border-2 border-[#5555ff] px-10 py-4 text-xl font-bold text-[#5555ff] transition hover:bg-[#f4f3ff]"
                                                >
                                                    <ChevronDown
                                                        className={`h-6 w-6 transition-transform ${
                                                            showAllUtilities ? 'rotate-180' : ''
                                                        }`}
                                                    />
                                                    {showAllUtilities
                                                        ? 'Weniger Ausstattungsmerkmale'
                                                        : 'Mehr Ausstattungsmerkmale'}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-gray-500">Noch keine Ausstattung hinterlegt.</p>
                                )}
                            </div>
                        </section>

                        {/* Location card */}
                        <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
                            <h2 className="mb-6 text-2xl font-bold text-gray-950">Standort</h2>

                            <p className="mb-6 flex items-center gap-3 text-base text-gray-700 md:text-lg">
                                <MapPin className="h-5 w-5 text-[#5555ff]" />
                                {formatAddress(address)}
                            </p>

                            {/* Static map placeholder until a real map integration is added */}
                            <div className="mb-6 flex h-80 items-center justify-center rounded-3xl bg-gradient-to-br from-[#f0edff] to-[#fff1fb]">
                                <div className="text-center">
                                    <MapPin className="mx-auto mb-4 h-20 w-20 text-[#5555ff]" />
                                    <p className="text-xl text-gray-600">{formatAddress(address)}</p>
                                </div>
                            </div>

                            {/* Opens Google Maps route planning in a new browser tab */}
                            <button
                                type="button"
                                onClick={handleRoutePlanning}
                                className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[#5555ff] py-4 text-base font-bold text-white transition hover:bg-[#4444ee] md:text-lg"
                            >
                                <Navigation className="h-7 w-7" />
                                Route planen
                            </button>
                        </section>

                        {/* Host card */}
                        <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
                            <h2 className="mb-6 text-2xl font-bold text-gray-950">Gastgeber</h2>

                            <div className="flex items-center gap-5">
                                {/* Show host profile image if available, otherwise show initials */}
                                {host?.profile_image && !hostImageFailed ? (
                                    <img
                                        src={getImageUrl(host.profile_image)}
                                        alt="Host profile"
                                        onError={() => {
                                            // Fall back to initials if the profile image path is invalid or missing.
                                            setHostImageFailed(true);
                                        }}
                                        className="h-20 w-20 rounded-2xl object-cover"
                                    />
                                ) : (
                                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#f4f3ff] text-2xl font-bold text-[#5555ff]">
                                        {(host?.first_name?.[0] || 'D').toUpperCase()}
                                    </div>
                                )}

                                <div>
                                    <h3 className="text-xl font-bold text-gray-950">
                                        {host?.first_name || host?.last_name
                                            ? `${host.first_name ?? ''} ${host.last_name ?? ''}`.trim()
                                            : 'Gastgeber:in'}
                                    </h3>

                                    <p className="mt-1 text-base text-gray-600">
                                        {commercialAccount?.company_name || 'Private:r Gastgeber:in'}
                                    </p>

                                    {/* Show the verification badge only when the host is actually verified. */}
                                    {isHostVerified && (
                                        <span className="mt-3 inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-base font-semibold text-green-700">
                                            <Check className="h-5 w-5" />
                                            Verifizierter Gastgeber
                                        </span>
                                    )}
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Booking sidebar */}
                    <aside className="lg:col-span-1">
                        <div className="sticky top-8 rounded-3xl border-2 border-[#5555ff] bg-white p-6 shadow-lg">
                            {/* Price headline */}
                            <div className="mb-8">
                                {selectedBookingPrice !== null ? (
                                    <div className="text-3xl font-bold text-gray-950">
                                        {!selectedDate && <span className="text-lg font-normal text-gray-600">ab </span>}
                                        €{selectedBookingPrice.toFixed(0)}
                                        <span className="text-lg font-normal text-gray-600">
                                            {selectedDuration === 'week' ? ' gesamt' : ` / ${selectedBookingLabel}`}
                                        </span>
                                    </div>
                                ) : (
                                    <p className="text-gray-500">Noch keine Preise hinterlegt.</p>
                                )}
                            </div>

                            {/* Duration selector */}
                            {bookingDurationOptions.length > 0 && (
                                <div className="mb-8">
                                    <label className="mb-4 block text-base font-bold text-gray-700">
                                        Zeitraum wählen
                                    </label>

                                    <div className="grid grid-cols-3 gap-3">
                                        {bookingDurationOptions.map(option => (
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
                                                {option.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Date selection */}
                            {selectedDuration !== 'month' ? (
                                <div className="relative mb-8">
                                    <label className="mb-4 block text-base font-bold text-gray-700">
                                        {selectedDuration === 'week' ? 'Startdatum' : 'Datum'}
                                    </label>

                                    <button
                                        type="button"
                                        onClick={() => setShowBookingDatePicker(!showBookingDatePicker)}
                                        className="flex w-full items-center gap-3 rounded-3xl border border-gray-200 bg-white px-4 py-4 text-left text-gray-700 transition hover:border-[#5555ff]"
                                    >
                                        <Calendar className="h-5 w-5 text-gray-400" />
                                        <span className={selectedDate ? 'font-semibold text-gray-900' : 'text-gray-400'}>
                                            {selectedDate
                                                ? new Date(selectedDate).toLocaleDateString('de-DE', {
                                                    weekday: 'short',
                                                    day: '2-digit',
                                                    month: 'short',
                                                    year: 'numeric',
                                                })
                                                : 'Datum wählen'}
                                        </span>
                                    </button>

                                    {showBookingDatePicker && (
                                        <div className="absolute left-0 right-0 z-20 mt-2 rounded-2xl border border-gray-200 bg-white p-4 shadow-2xl">
                                            <DatePicker
                                                selectedDate={selectedDate}
                                                onDateSelect={date => {
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
                                        Monat
                                    </label>

                                    <select
                                        value={selectedMonth}
                                        onChange={event => {
                                            const value = event.target.value;
                                            setSelectedMonth(value);

                                            if (value) {
                                                setSelectedDate(`${value}-01`);
                                            }
                                        }}
                                        className="w-full rounded-3xl border border-gray-200 bg-white px-4 py-4 text-gray-700 focus:border-[#5555ff] focus:outline-none focus:ring-2 focus:ring-[#5555ff]/20"
                                    >
                                        <option value="">Monat wählen</option>
                                        {Array.from({ length: 12 }, (_, index) => {
                                            const date = new Date();
                                            date.setMonth(date.getMonth() + index);

                                            const year = date.getFullYear();
                                            const month = String(date.getMonth() + 1).padStart(2, '0');
                                            const value = `${year}-${month}`;
                                            const monthNames = [
                                                'Januar',
                                                'Februar',
                                                'März',
                                                'April',
                                                'Mai',
                                                'Juni',
                                                'Juli',
                                                'August',
                                                'September',
                                                'Oktober',
                                                'November',
                                                'Dezember',
                                            ];

                                            return (
                                                <option key={value} value={value}>
                                                    {monthNames[date.getMonth()]} {year}
                                                </option>
                                            );
                                        })}
                                    </select>
                                </div>
                            )}

                            {/* Hourly time selection */}
                            {selectedDuration === 'hour' && (
                                <div className="mb-8">
                                    <label className="mb-4 block text-base font-bold text-gray-700">
                                        Uhrzeit
                                    </label>

                                    <div className="grid grid-cols-2 gap-3">
                                        <label className="rounded-3xl bg-gray-100 px-4 py-3">
                                            <span className="mb-1 flex items-center gap-2 text-xs font-semibold text-gray-500">
                                                <Clock className="h-4 w-4" />
                                                Von
                                            </span>
                                            <input
                                                type="time"
                                                value={selectedStartTime}
                                                onChange={event => setSelectedStartTime(event.target.value)}
                                                className="w-full bg-transparent text-base font-bold text-gray-900 outline-none"
                                            />
                                        </label>

                                        <label className="rounded-3xl bg-gray-100 px-4 py-3">
                                            <span className="mb-1 flex items-center gap-2 text-xs font-semibold text-gray-500">
                                                <Clock className="h-4 w-4" />
                                                Bis
                                            </span>
                                            <input
                                                type="time"
                                                value={selectedEndTime}
                                                onChange={event => setSelectedEndTime(event.target.value)}
                                                className="w-full bg-transparent text-base font-bold text-gray-900 outline-none"
                                            />
                                        </label>
                                    </div>
                                </div>
                            )}

                            {/* Half-day period selection */}
                            {selectedDuration === 'half_day' && (
                                <div className="mb-8">
                                    <label className="mb-4 block text-base font-bold text-gray-700">
                                        Zeitraum
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
                                            <span className="block text-lg font-bold">Vormittag</span>
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
                                            <span className="block text-lg font-bold">Nachmittag</span>
                                            <span className="mt-1 block text-sm font-semibold opacity-80">
                                                13:00 – 17:00
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Booking button */}
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
                                {deskrl.instant_bookable ? 'Reservieren' : 'Anfragen'}
                            </button>

                            <p className="text-center text-sm leading-5 text-gray-500">
                                Keine Buchungsgebühren • Kostenlose Stornierung bis 24h vorher
                            </p>
                        </div>
                    </aside>
                </div>
            </div>

            {/* Auth modal is opened when guests try to book. */}
            <AuthModal
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
                initialMode="login"
            />

            {/* Booking modal is opened when authenticated users try to book. */}
            <BookingConfirmationModal
                isOpen={showBookingModal}
                onClose={() => setShowBookingModal(false)}
                onConfirm={handleBookingConfirm}
                spaceName={title}
                duration={selectedDuration}
                price={selectedBookingPrice ?? 0}
                date={selectedDate}
            />
        </div>
    );
}

/**
 * Wraps the Deskrl detail page with the global app layout.
 * The layout is responsible for rendering shared elements like header and footer.
 */
Show.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>;
