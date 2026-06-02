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
import AppLayout from '@/Layouts/AppLayout';
import DeskrlLocationMap from '@/components/maps/DeskrlLocationMap';
import { BookingConfirmationModal } from '@/components/BookingModal';
import { useFavorites } from '@/contexts/FavoritesContext';

type LocalizedText =
    | string
    | {
    de?: string;
    en?: string;
    [key: string]: string | undefined;
};

type DeskrlImage = {
    id: number;
    path: string;
    is_main?: boolean;
    sort_order?: number;
};

type DeskrlCategory = {
    id: number;
    name: string;
    mask_type?: string;
};

type UtilityCategory = {
    id: number;
    category_name: LocalizedText;
};

type Utility = {
    id: number;
    name: LocalizedText;
    utility_category?: UtilityCategory;
    utilityCategory?: UtilityCategory;
    pivot?: {
        quantity?: number | null;
    };
};

type Address = {
    id: number;
    city?: string;
    street?: string;
    house_nr?: string;
    postal_code?: string;
    state?: string | null;
    latitude?: number | string | null;
    longitude?: number | string | null;
};

type DeskrlAddress = {
    address?: Address;
};

type CommercialAccount = {
    id: number;
    company_name?: string;
    is_verified?: boolean;
};

type HostAccount = {
    id: number;
    first_name?: string;
    last_name?: string;
    profile_image?: string | null;
    commercial_account?: CommercialAccount;
    commercialAccount?: CommercialAccount;
};

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

    deskrl_category?: DeskrlCategory;
    deskrl_address?: DeskrlAddress;
    host_account?: HostAccount;

    deskrlCategory?: DeskrlCategory;
    deskrlAddress?: DeskrlAddress;
    hostAccount?: HostAccount;

    images?: DeskrlImage[];
    utilities?: Utility[];
};

type Props = {
    deskrl: Deskrl;
};

type PageProps = {
    auth?: {
        user?: {
            id: number;
            first_name?: string;
            last_name?: string;
            email?: string;
            account_type?: string;
            role?: string;
        } | null;
    };
};

type BookingDuration = 'hour' | 'half_day' | 'day' | 'week' | 'month';

type BackendPriceRate = 'hour' | 'half_day' | 'day' | 'week' | 'month';

type BookingDurationOption = {
    key: BookingDuration;
    label: string;
    price: number | null;
};

type BookingRequestPayload = {
    deskrl_id: number;
    price_rate: BackendPriceRate;
    from: string;
    until: string;
    price: number;
};

function getLocalizedText(value?: LocalizedText): string {
    if (!value) return '';

    if (typeof value === 'string') {
        return value;
    }

    return value.de || value.en || Object.values(value).find(Boolean) || '';
}

function getImageUrl(path: string): string {
    if (path.startsWith('http') || path.startsWith('/')) {
        return path;
    }

    return `/${path}`;
}

function parsePrice(value?: number | string | null): number | null {
    if (value === null || value === undefined || value === '') {
        return null;
    }

    const numericValue = Number(value);

    return Number.isFinite(numericValue) ? numericValue : null;
}

function formatAddress(address?: Address): string {
    if (!address) return 'Adresse noch nicht verfügbar';

    return [
        address.street && address.house_nr ? `${address.street} ${address.house_nr}` : address.street,
        address.postal_code && address.city ? `${address.postal_code} ${address.city}` : address.city,
    ]
        .filter(Boolean)
        .join(', ');
}

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

export default function Show({ deskrl }: Props) {
    const { props } = usePage<PageProps>();
    const { auth } = props;

    const isLoggedIn = Boolean(auth?.user);

    const accountType = auth?.user?.account_type ?? auth?.user?.role ?? 'guest';
    const isRegularUser = accountType === 'user';

    const { toggleFavorite, isFavorited } = useFavorites();
    const isCurrentDeskrlFavorited = isFavorited(deskrl.id);

    const [selectedImage, setSelectedImage] = useState(0);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [showShareMenu, setShowShareMenu] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [isSubmittingBookingRequest, setIsSubmittingBookingRequest] = useState(false);

    const [selectedDate, setSelectedDate] = useState('');
    const [showBookingDatePicker, setShowBookingDatePicker] = useState(false);
    const [halfdayPeriod, setHalfdayPeriod] = useState<'morning' | 'afternoon'>('morning');
    const [selectedStartTime, setSelectedStartTime] = useState('09:00');
    const [selectedEndTime, setSelectedEndTime] = useState('10:00');
    const [selectedMonth, setSelectedMonth] = useState('');
    const [showAllUtilities, setShowAllUtilities] = useState(false);
    const [hostImageFailed, setHostImageFailed] = useState(false);

    const [selectedDuration, setSelectedDuration] = useState<BookingDuration>(() => {
        if (deskrl.price_per_half_day) return 'half_day';
        if (deskrl.price_per_day) return 'day';
        if (deskrl.price_per_hour) return 'hour';
        if (deskrl.price_per_week) return 'week';
        return 'month';
    });

    const category = deskrl.deskrl_category || deskrl.deskrlCategory;
    const address = deskrl.deskrl_address?.address || deskrl.deskrlAddress?.address;
    const host = deskrl.host_account || deskrl.hostAccount;

    const commercialAccount = host?.commercial_account || host?.commercialAccount;
    const isHostVerified = commercialAccount?.is_verified === true;

    const title = getLocalizedText(deskrl.title) || 'Deskrl ohne Titel';
    const description = getLocalizedText(deskrl.description) || 'Für diesen Deskrl gibt es noch keine Beschreibung.';

    const images = useMemo(() => {
        return (
            [...(deskrl.images ?? [])]
                .sort((a, b) => Number(b.is_main) - Number(a.is_main) || (a.sort_order ?? 0) - (b.sort_order ?? 0))
                .map((image) => getImageUrl(image.path))
        );
    }, [deskrl.images]);

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
        bookingDurationOptions.find((option) => option.key === selectedDuration) ?? bookingDurationOptions[0];

    const selectedBookingPrice = selectedDurationOption?.price ?? null;
    const selectedBookingLabel = selectedDurationOption?.label ?? 'Zeitraum';

    const groupedUtilities = useMemo(() => {
        const groups: Record<string, Utility[]> = {};

        deskrl.utilities?.forEach((utility) => {
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

    const visibleUtilityGroups = showAllUtilities ? groupedUtilities : groupedUtilities.slice(0, 3);

    const buildBookingPeriod = (): { from: string; until: string } | null => {
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

        return null;
    };

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

    const handleBookingClick = () => {
        if (!isLoggedIn) {
            setShowAuthModal(true);
            return;
        }

        if (selectedBookingPrice === null) {
            toast.error('Für diesen Zeitraum ist kein Preis hinterlegt.');
            return;
        }

        if (selectedDuration === 'month') {
            if (!selectedMonth) {
                toast.error('Bitte wähle zuerst einen Monat aus.');
                return;
            }
        } else if (!selectedDate) {
            toast.error('Bitte wähle zuerst ein Datum aus.');
            return;
        }

        setShowBookingModal(true);
    };

    const handleBookingConfirm = () => {
        const period = buildBookingPeriod();

        if (!period) {
            toast.error('Bitte wähle einen gültigen Zeitraum aus.');
            return;
        }

        if (selectedBookingPrice === null) {
            toast.error('Für diesen Zeitraum ist kein Preis hinterlegt.');
            return;
        }

        setIsSubmittingBookingRequest(true);

        const payload: BookingRequestPayload = {
            deskrl_id: deskrl.id,
            price_rate: selectedDuration as BackendPriceRate,
            from: period.from,
            until: period.until,
            price: selectedBookingPrice,
        };

        router.post('/bookings', payload, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Buchungsanfrage wurde gesendet.');
                setShowBookingModal(false);
            },
            onError: () => {
                toast.error('Buchungsanfrage konnte nicht gesendet werden.');
            },
            onFinish: () => {
                setIsSubmittingBookingRequest(false);
            },
        });
    };

    const handleFavoriteClick = async () => {
        if (!isLoggedIn) {
            setShowAuthModal(true);
            return;
        }

        if (!isRegularUser) {
            toast.info('Favoriten können aktuell nur von Nutzer:innen gespeichert werden.');
            return;
        }

        try {
            await toggleFavorite(deskrl.id);

            toast.success(
                isCurrentDeskrlFavorited
                    ? 'Deskrl wurde aus deinen Gemerkten entfernt.'
                    : 'Deskrl wurde zu deinen Gemerkten hinzugefügt.',
            );
        } catch {
            toast.error('Favorit konnte nicht gespeichert werden.');
        }
    };

    const handleRoutePlanning = () => {
        window.open(
            `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(formatAddress(address))}`,
            '_blank',
        );
    };

    return (
        <div className="min-h-screen bg-gray-50">
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

                    <img src={images[selectedImage]} alt={title} className="max-h-[90vh] max-w-[90vw] object-contain" />

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
                <Link href="/" className="mb-6 inline-flex items-center gap-2 text-gray-600 hover:text-[#5555ff]">
                    <ArrowLeft className="h-5 w-5" />
                    Zurück zur Suche
                </Link>

                <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
                    <div>
                        {category?.name && (
                            <span className="mb-3 inline-block rounded-full bg-[#f4f3ff] px-4 py-1 text-sm font-semibold text-[#5555ff]">
                                {category.name}
                            </span>
                        )}

                        <h1 className="mb-3 text-2xl font-bold leading-tight text-gray-950 md:text-4xl">{title}</h1>

                        <div className="flex flex-wrap items-center gap-4 text-gray-600">
                            <p className="flex items-center gap-2 text-base text-gray-600 md:text-lg">
                                <MapPin className="h-5 w-5 text-[#5555ff]" />
                                {address?.city || 'Ort noch nicht verfügbar'}
                            </p>
                        </div>
                    </div>

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
                            className={`flex items-center gap-2 rounded-xl border px-4 py-2 font-semibold transition-colors ${
                                isCurrentDeskrlFavorited
                                    ? 'border-[#e63cff] bg-[#fff1fb] text-[#e63cff]'
                                    : 'border-gray-200 bg-white hover:border-[#e63cff] hover:text-[#e63cff]'
                            }`}
                        >
                            <Heart
                                className={`h-5 w-5 ${
                                    isCurrentDeskrlFavorited ? 'fill-[#e63cff] text-[#e63cff]' : ''
                                }`}
                            />
                            {isCurrentDeskrlFavorited ? 'Gemerkt' : 'Merken'}
                        </button>
                    </div>
                </div>

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
                    <div className="space-y-8 lg:col-span-2">
                        <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
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

                            <div className="border-b border-gray-200 py-8">
                                <h2 className="mb-6 text-2xl font-bold text-gray-950">Über diesen Raum</h2>

                                <p className="text-base leading-7 text-gray-700 md:text-lg">{description}</p>
                            </div>

                            <div className="pt-8">
                                <h2 className="mb-8 text-2xl font-bold text-gray-950">Ausstattung & Services</h2>

                                {groupedUtilities.length > 0 ? (
                                    <div className="space-y-10">
                                        {visibleUtilityGroups.map((group) => {
                                            const CategoryIcon = group.Icon;

                                            return (
                                                <div key={group.categoryName}>
                                                    <div className="mb-5 flex items-center gap-3">
                                                        <CategoryIcon className="h-6 w-6 text-[#5555ff]" />
                                                        <h3 className="text-lg font-bold text-gray-950 md:text-xl">
                                                            {group.categoryName}
                                                        </h3>
                                                    </div>

                                                    <div className="grid gap-4 md:grid-cols-2">
                                                        {group.utilities.map((utility) => {
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
                                                                        {utility.pivot?.quantity
                                                                            ? ` (${utility.pivot.quantity})`
                                                                            : ''}
                                                                    </span>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            );
                                        })}

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

                        <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
                            <h2 className="mb-6 text-2xl font-bold text-gray-950">Standort</h2>

                            <p className="mb-6 flex items-center gap-3 text-base text-gray-700 md:text-lg">
                                <MapPin className="h-5 w-5 text-[#5555ff]" />
                                {formatAddress(address)}
                            </p>

                            <div className="mb-6">
                                <DeskrlLocationMap latitude={address?.latitude} longitude={address?.longitude} />
                            </div>

                            <button
                                type="button"
                                onClick={handleRoutePlanning}
                                className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[#5555ff] py-4 text-base font-bold text-white transition hover:bg-[#4444ee] md:text-lg"
                            >
                                <Navigation className="h-7 w-7" />
                                Route planen
                            </button>
                        </section>

                        <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
                            <h2 className="mb-6 text-2xl font-bold text-gray-950">Gastgeber</h2>

                            <div className="flex items-center gap-5">
                                {host?.profile_image && !hostImageFailed ? (
                                    <img
                                        src={getImageUrl(host.profile_image)}
                                        alt="Host profile"
                                        onError={() => setHostImageFailed(true)}
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

                    <aside className="lg:col-span-1">
                        <div className="sticky top-8 rounded-3xl border-2 border-[#5555ff] bg-white p-6 shadow-lg">
                            <div className="mb-8">
                                {selectedBookingPrice !== null ? (
                                    <div className="text-3xl font-bold text-gray-950">
                                        {!selectedDate && selectedDuration !== 'month' && (
                                            <span className="text-lg font-normal text-gray-600">ab </span>
                                        )}
                                        €{selectedBookingPrice.toFixed(0)}
                                        <span className="text-lg font-normal text-gray-600">
                                            {selectedDuration === 'week' ? ' gesamt' : ` / ${selectedBookingLabel}`}
                                        </span>
                                    </div>
                                ) : (
                                    <p className="text-gray-500">Noch keine Preise hinterlegt.</p>
                                )}
                            </div>

                            {bookingDurationOptions.length > 0 && (
                                <div className="mb-8">
                                    <label className="mb-4 block text-base font-bold text-gray-700">
                                        Zeitraum wählen
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
                                                {option.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

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
                                    <label className="mb-4 block text-base font-bold text-gray-700">Monat</label>

                                    <select
                                        value={selectedMonth}
                                        onChange={(event) => {
                                            const value = event.target.value;
                                            setSelectedMonth(value);

                                            if (value) {
                                                setSelectedDate(`${value}-01`);
                                            } else {
                                                setSelectedDate('');
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

                            {selectedDuration === 'hour' && (
                                <div className="mb-8">
                                    <label className="mb-4 block text-base font-bold text-gray-700">Uhrzeit</label>

                                    <div className="grid grid-cols-2 gap-3">
                                        <label className="rounded-3xl bg-gray-100 px-4 py-3">
                                            <span className="mb-1 flex items-center gap-2 text-xs font-semibold text-gray-500">
                                                <Clock className="h-4 w-4" />
                                                Von
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
                                                <Clock className="h-4 w-4" />
                                                Bis
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
                                    <label className="mb-4 block text-base font-bold text-gray-700">Zeitraum</label>

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
                                {isSubmittingBookingRequest
                                    ? 'Wird gesendet...'
                                    : deskrl.instant_bookable
                                        ? 'Reservieren'
                                        : 'Anfragen'}
                            </button>

                            <p className="text-center text-sm leading-5 text-gray-500">
                                Keine Buchungsgebühren • Kostenlose Stornierung bis 24h vorher
                            </p>
                        </div>
                    </aside>
                </div>
            </div>

            <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} initialMode="login" />

            <BookingConfirmationModal
                isOpen={showBookingModal}
                onClose={() => setShowBookingModal(false)}
                onConfirm={handleBookingConfirm}
                spaceName={title}
                duration={selectedDuration}
                price={selectedBookingPrice ?? 0}
                date={selectedDuration === 'month' ? selectedMonth : selectedDate}
            />
        </div>
    );
}

Show.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>;
