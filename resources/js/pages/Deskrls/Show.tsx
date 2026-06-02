import { Link } from '@inertiajs/react';
import React, {ReactNode, useMemo, useState} from 'react';
import {
    ArrowLeft,
    Bike,
    Building2,
    Check,
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
import AppLayout from "@/Layouts/AppLayout";
import DeskrlLocationMap from '@/components/maps/DeskrlLocationMap';

import About from "@/pages/About";

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
    latitude?: number | string | null;
    longitude?: number | string | null;
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
 * Converts numeric values from Laravel into readable euro prices.
 * Laravel decimal values may arrive as strings, so Number() is used here.
 */
function formatPrice(value?: number | string | null): string | null {
    if (value === null || value === undefined || value === '') {
        return null;
    }

    return `€${Number(value).toFixed(0)}`;
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

export default function Show({ deskrl }: Props) {
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
     * This is currently used as a placeholder for booking actions.
     */
    const [showAuthModal, setShowAuthModal] = useState(false);

    /**
     * Stores the selected date from the DatePicker.
     * Booking logic is not implemented yet.
     */
    const [selectedDate, setSelectedDate] = useState('');

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
     * Build a list of available price options.
     * Empty prices are filtered out so only existing prices are displayed.
     */
    const priceOptions = [
        { label: 'Stunde', value: formatPrice(deskrl.price_per_hour) },
        { label: 'Halbtag', value: formatPrice(deskrl.price_per_half_day) },
        { label: 'Tag', value: formatPrice(deskrl.price_per_day) },
        { label: 'Woche', value: formatPrice(deskrl.price_per_week) },
        { label: 'Monat', value: formatPrice(deskrl.price_per_month) },
    ].filter(price => price.value);

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
     * Placeholder handler for the booking button.
     * Later this can open a booking wizard or send a booking request.
     */
    const handleBookingClick = () => {
        setShowAuthModal(true);
    };

    /**
     * Placeholder handler for favorites.
     * Later this can call the FavoriteController through Inertia.
     */
    const handleFavoriteClick = () => {
        toast.info('Favoriten-Funktion wird später angebunden.');
    };

    /**
     * Opens Google Maps route planning for the current Deskrl address.
     * This link works independently of the embedded map API key.
     */
    const handleRoutePlanning = () => {
        window.open(
            `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(formatAddress(address))}`,
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
                                <MapPin className="h-5 w-5 text-[#5555ff]"/>
                                {address?.city || 'Ort noch nicht verfügbar'}
                            </p>

                            {/*
                              Rating placeholder:
                              Reviews are not part of the current MVP yet.
                              Keep this block commented until ratings are implemented in the backend.
                            */}
                            {/*
                            <p className="flex items-center gap-2 text-2xl">
                                <Star className="h-7 w-7 fill-yellow-400 text-yellow-400" />
                                <span className="font-bold text-gray-800">4.9</span>
                                <span>(127 Bewertungen)</span>
                            </p>
                            */}
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

                                                                    <span
                                                                        className="text-base font-semibold text-gray-950 md:text-lg">
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
                                                        className={`h-6 w-6 transition-transform ${showAllUtilities ? 'rotate-180' : ''}`}
                                                    />
                                                    {showAllUtilities ? 'Weniger Ausstattungsmerkmale' : 'Mehr Ausstattungsmerkmale'}
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
                                <MapPin className="h-5 w-5 text-[#5555ff]"/>
                                {formatAddress(address)}
                            </p>

                            {/* Interactive Google Map; it becomes active once an API key is configured. */}
                            <div className="mb-6">
                                <DeskrlLocationMap
                                    latitude={address?.latitude}
                                    longitude={address?.longitude}
                                />
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
                                        <span
                                            className="mt-3 inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-base font-semibold text-green-700">
                                            <Check className="h-5 w-5"/>
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
                            <h2 className="mb-4 text-2xl font-bold text-gray-900">Buchung</h2>

                            {/* Price overview */}
                            {priceOptions.length > 0 ? (
                                <div className="mb-6 space-y-3">
                                    {priceOptions.map(price => (
                                        <div
                                            key={price.label}
                                            className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3"
                                        >
                                            <span className="text-gray-600">{price.label}</span>
                                            <span className="font-bold text-gray-900">{price.value}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="mb-6 text-gray-500">Noch keine Preise hinterlegt.</p>
                            )}

                            {/* Date selection placeholder for future booking flow */}
                            <div className="mb-6">
                                <label className="mb-2 block text-sm font-semibold text-gray-700">
                                    Wunschdatum
                                </label>

                                <DatePicker
                                    selectedDate={selectedDate}
                                    onDateSelect={setSelectedDate}
                                    minDate={new Date().toISOString().split('T')[0]}
                                />
                            </div>

                            {/* Booking button without real booking logic yet */}
                            <button
                                type="button"
                                onClick={handleBookingClick}
                                className="mb-3 w-full rounded-2xl bg-[#e63cff] py-4 font-bold text-white transition hover:bg-[#d12ee6]"
                            >
                                Reservieren
                            </button>

                            <p className="text-center text-xs text-gray-500">
                                Die Buchungslogik wird im nächsten Schritt angebunden.
                            </p>
                        </div>
                    </aside>
                </div>
            </div>

            {/* Auth modal is used as temporary placeholder for booking login flow */}
            <AuthModal
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
                initialMode="login"
            />
        </div>
    );
}
/**
 * Wraps the Deskrl detail page with the global app layout.
 * The layout is responsible for rendering shared elements like header and footer.
 */
Show.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>;
