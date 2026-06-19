import AppLayout from '@/Layouts/AppLayout';
import { usePage } from '@inertiajs/react';
import type { InertiaPage } from '@/types/inertia';
import { DatePicker } from '@/components/DatePicker';
import { router } from '@inertiajs/react';
import { useFavorites } from '@/contexts/FavoritesContext';
import AuthModal from '@/components/AuthModal';
import {
    Search, MapPin, Calendar, Xmark, Heart, HeartSolid,
    FilterList, Position, LayoutRight, Map,
    DatabaseMonitor, Wifi, VideoProjector, Printer, PasteClipboard,
    CoffeeCup, Home as HomeIcon, SnowFlake, Healthcare,
    Parking, EvPlugCharging, Tree, Building,
} from 'iconoir-react';
import {
    useEffect,
    useRef,
    useState,
    type KeyboardEvent,
    type MouseEvent as ReactMouseEvent,
    type ReactNode,
} from 'react';
import { useIntl } from 'react-intl';

const PLACEHOLDER_IMAGES: Record<string, string> = {
    default: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
    arbeitsplatz: 'https://images.unsplash.com/photo-1505330622279-bf7d7fc918f4?w=800&q=80',
    meetingraum: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
    seminarraum: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80',
    coworking: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&q=80',
    event: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
};

const LOCATION_SUGGESTIONS = [
    'Wien, 1. Bezirk',
    'Wien, 2. Bezirk',
    'Wien, 3. Bezirk',
    'Wien, 9. Bezirk',
    'Wieselburg',
    'Wiener Neustadt',
    'Linz',
];

const ROOM_TYPES = [
    { value: 'Arbeitsplatz', labelKey: 'home.filter.roomType.workplace' },
    { value: 'Meetingraum', labelKey: 'home.filter.roomType.meetingRoom' },
    { value: 'Seminarraum', labelKey: 'home.filter.roomType.seminarRoom' },
    { value: 'Coworking', labelKey: 'home.filter.roomType.coworking' },
    { value: 'Eventlocation', labelKey: 'home.filter.roomType.eventLocation' },
] as const;

type LocalizedText = string | {
    de?: string;
    en?: string;
};

type DeskrlImage = {
    id: number;
    path: string;
    is_main?: boolean;
    sort_order?: number;
};

type DeskrlUtility = {
    id: number;
    name: LocalizedText;
    pivot?: {
        quantity?: number | null;
    };
};

type DeskrlAddressRelation = {
    address?: {
        city?: string;
        street?: string;
        house_nr?: string;
        postal_code?: string;
        latitude?: number | string | null;
        longitude?: number | string | null;
    };
};

type DeskrlCategory = {
    id: number;
    name: string;
    mask_type?: string;
};

type Deskrl = {
    id: number;
    title: LocalizedText;
    description?: LocalizedText;
    status: string;
    capacity?: number;
    price_per_hour?: number | string | null;
    price_per_half_day?: number | string | null;
    price_per_day?: number | string | null;
    deskrl_category?: DeskrlCategory;
    deskrlCategory?: DeskrlCategory;
    deskrl_address?: DeskrlAddressRelation;
    deskrlAddress?: DeskrlAddressRelation;
    images?: DeskrlImage[];
    utilities?: DeskrlUtility[];
};

type UtilityCategoryRelation = {
    id: number;
    category_name: LocalizedText;
};

type Utility = {
    id: number;
    name: LocalizedText;
    utility_category_id?: number;
    utility_category?: UtilityCategoryRelation;
    utilityCategory?: UtilityCategoryRelation;
};

type HomeProps = {
    deskrls: Deskrl[];
    utilities?: Utility[];
    filters?: {
        search?: string;
        type?: string;
        date?: string;
        start_time?: string;
        end_time?: string;
        amenities?: string | string[];
    };
};

// Returns localized text from JSON, stringified JSON or a plain string.
function getLocalizedText(
    value: LocalizedText | undefined | null,
    fallback = '',
    locale = 'de',
): string {
    if (!value) {
        return fallback;
    }

    if (typeof value === 'string') {
        try {
            const parsed = JSON.parse(value);

            if (typeof parsed === 'object' && parsed !== null) {
                return parsed?.[locale] ?? parsed?.de ?? parsed?.en ?? fallback;
            }

            return value;
        } catch {
            return value;
        }
    }

    return value[locale as keyof typeof value] ?? value.de ?? value.en ?? fallback;
}

// Maps each utility name to a matching icon.
function getUtilityIcon(name: string) {
    const key = name.toLowerCase();

    if (key.includes('wlan')) return <Wifi className="h-4 w-4 text-[#5555ff]" />;
    if (key.includes('beamer')) return <VideoProjector className="h-4 w-4 text-[#5555ff]" />;
    if (key.includes('bildschirm')) return <DatabaseMonitor className="h-4 w-4 text-[#5555ff]" />;
    if (key.includes('drucker')) return <Printer className="h-4 w-4 text-[#5555ff]" />;
    if (key.includes('flipchart')) return <PasteClipboard className="h-4 w-4 text-[#5555ff]" />;
    if (key.includes('küche') || key.includes('kueche')) return <CoffeeCup className="h-4 w-4 text-[#5555ff]" />;
    if (key.includes('wc')) return <HomeIcon className="h-4 w-4 text-[#5555ff]" />;
    if (key.includes('klima')) return <SnowFlake className="h-4 w-4 text-[#5555ff]" />;
    if (key.includes('kaffee')) return <CoffeeCup className="h-4 w-4 text-[#5555ff]" />;
    if (key.includes('barrierefrei')) return <Healthcare className="h-4 w-4 text-[#5555ff]" />;
    if (key.includes('parkplatz')) return <Parking className="h-4 w-4 text-[#5555ff]" />;
    if (key.includes('ladestation')) return <EvPlugCharging className="h-4 w-4 text-[#5555ff]" />;
    if (key.includes('catering')) return <CoffeeCup className="h-4 w-4 text-[#5555ff]" />;
    if (key.includes('garten')) return <Tree className="h-4 w-4 text-[#5555ff]" />;
    if (key.includes('terrasse')) return <Tree className="h-4 w-4 text-[#5555ff]" />;

    return <Building className="h-4 w-4 text-[#5555ff]" />;
}

// Returns the category name from either possible backend relation name.
function getCategoryName(deskrl: Deskrl, fallback: string): string {
    return deskrl.deskrl_category?.name
        ?? deskrl.deskrlCategory?.name
        ?? fallback;
}

// Returns the related address from either possible backend relation name.
function getAddress(deskrl: Deskrl) {
    return deskrl.deskrl_address?.address
        ?? deskrl.deskrlAddress?.address
        ?? null;
}

// Returns the main image URL or a placeholder image.
function getMainImage(deskrl: Deskrl): string {
    const mainImage = deskrl.images?.find((image) => image.is_main) ?? deskrl.images?.[0];

    if (!mainImage?.path) {
        return PLACEHOLDER_IMAGES.default;
    }

    if (mainImage.path.startsWith('http')) {
        return mainImage.path;
    }

    return `/storage/${mainImage.path}`;
}

// Returns a category-specific placeholder image.
function getPlaceholderByCategory(category: string): string {
    const key = category.toLowerCase();

    if (key.includes('arbeitsplatz')) {
        return PLACEHOLDER_IMAGES.arbeitsplatz;
    }

    if (key.includes('meeting')) {
        return PLACEHOLDER_IMAGES.meetingraum;
    }

    if (key.includes('seminar')) {
        return PLACEHOLDER_IMAGES.seminarraum;
    }

    if (key.includes('coworking') || key.includes('co-working')) {
        return PLACEHOLDER_IMAGES.coworking;
    }

    if (key.includes('event')) {
        return PLACEHOLDER_IMAGES.event;
    }

    return PLACEHOLDER_IMAGES.default;
}

// Formats the hourly price for card display.
function formatPrice(value: number | string | null | undefined): string {
    if (value === null || value === undefined || value === '') {
        return '?';
    }

    const numberValue = Number(value);

    if (Number.isNaN(numberValue)) {
        return '?';
    }

    return numberValue.toFixed(0);
}

function DeskrlCard({ deskrl, onLoginRequired }: { deskrl: Deskrl; onLoginRequired: () => void }) {
    const intl = useIntl();
    const { isFavorited, toggleFavorite } = useFavorites();

    const { props } = usePage();
    const { auth } = props as any;
    const isLoggedIn = !!auth?.user;

    // Returns the translated text for the given translation key.
    const t = (id: string, values?: Record<string, string | number>) =>
        intl.formatMessage({ id }, values);

    const locale = intl.locale || 'de';

    const title = getLocalizedText(deskrl.title, t('home.card.untitled'), locale);
    const category = getCategoryName(deskrl, t('home.card.categoryFallback'));
    const address = getAddress(deskrl);
    const imageFromDb = getMainImage(deskrl);
    const fallbackImage = getPlaceholderByCategory(category);
    const utilities = deskrl.utilities ?? [];
    const isCurrentlyFavorited = isFavorited(deskrl.id);

    /**
     * Opens the detail page for the selected Deskrl.
     */
    const openDetailPage = () => {
        router.visit(`/deskrls/${deskrl.id}`);
    };

    /**
     * Allows keyboard users to open the detail page with Enter or Space.
     */
    const handleCardKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openDetailPage();
        }
    };

    /**
     * Handles the favorite button without opening the detail page.
     */
    const handleFavorite = (event: ReactMouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        event.preventDefault();

        if (!isLoggedIn) {
            onLoginRequired();
            return;
        }

        toggleFavorite(deskrl.id);
    };

    return (
        <div
            role="link"
            tabIndex={0}
            onClick={openDetailPage}
            onKeyDown={handleCardKeyDown}
            aria-label={t('home.card.detailsAria', { title })}
            className="bg-white rounded-2xl shadow hover:shadow-xl transition-all overflow-hidden flex flex-col border border-gray-100 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#5555ff] focus:ring-offset-2"
        >
            <div className="relative h-56 overflow-hidden">
                <img
                    src={imageFromDb}
                    alt={title}
                    onError={(event) => {
                        event.currentTarget.src = fallbackImage;
                    }}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />

                <button
                    type="button"
                    onClick={handleFavorite}
                    aria-label={
                        isCurrentlyFavorited
                            ? t('home.card.removeFavorite')
                            : t('home.card.addFavorite')
                    }
                    className="absolute top-4 left-4 bg-white rounded-full p-2 shadow"
                >
                    {isCurrentlyFavorited
                        ? <HeartSolid className="h-4 w-4 text-red-500" aria-hidden="true" />
                        : <Heart className="h-4 w-4 text-gray-400" aria-hidden="true" />
                    }
                </button>

                <span className="absolute top-4 right-4 bg-white text-sm font-semibold px-3 py-1 rounded-full shadow">
                    {category}
                </span>
            </div>

            <div className="p-6 flex flex-col gap-2 flex-1">
                <h2 className="font-bold text-xl">{title}</h2>

                <p className="text-sm text-gray-500 flex items-center gap-1">
                    <MapPin className="h-4 w-4" aria-hidden="true" />
                    {address?.city ?? t('home.card.unknownLocation')}
                    {address?.street ? ` · ${address.street}` : ''}
                </p>

                <div className="flex flex-wrap gap-2 mb-2">
                    {utilities.length > 0 ? (
                        <>
                            {utilities.slice(0, 3).map((utility) => {
                                const utilityName = getLocalizedText(
                                    utility.name,
                                    t('home.card.utilityFallback'),
                                    locale,
                                );

                                return (
                                    <span
                                        key={utility.id}
                                        className="text-xs bg-[#f5f5ff] text-[#5555ff] rounded-full px-3 py-1 font-semibold"
                                    >
                                        {utilityName}
                                        {utility.pivot?.quantity ? ` (${utility.pivot.quantity})` : ''}
                                    </span>
                                );
                            })}

                            {utilities.length > 3 && (
                                <span className="text-xs bg-gray-100 text-gray-600 rounded-full px-3 py-1 font-semibold">
                                    +{utilities.length - 3}
                                </span>
                            )}
                        </>
                    ) : (
                        <span className="text-xs bg-gray-100 text-gray-600 rounded-full px-3 py-1 font-semibold">
                            {t('home.card.noUtilities')}
                        </span>
                    )}
                </div>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                    <span className="text-[#5555ff] font-bold text-2xl">
                        €{formatPrice(deskrl.price_per_hour)}
                        <span className="text-sm font-normal text-gray-500">
                            {t('home.card.perHour')}
                        </span>
                    </span>

                    <span className="text-sm text-gray-900 flex items-center gap-1">
                        <span className="text-yellow-400 text-lg" aria-hidden="true">★</span>
                        <span className="font-semibold">4.5</span>
                        <span className="text-gray-500">(127)</span>
                    </span>
                </div>
            </div>
        </div>
    );
}

const Home: InertiaPage<HomeProps> = ({ deskrls = [], utilities = [], filters = {} }) => {
    const intl = useIntl();

    const [search, setSearch] = useState(filters.search ?? '');
    const [type, setType] = useState(filters.type ?? '');
    const [filterOpen, setFilterOpen] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [startTime, setStartTime] = useState(filters.start_time ?? '09:00');
    const [endTime, setEndTime] = useState(filters.end_time ?? '17:00');
    const [selectedDate, setSelectedDate] = useState(filters.date ?? '');
    const [visibleCount, setVisibleCount] = useState(6);
    const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

    // Amenities contains selected utility IDs matching the database.
    const [amenities, setAmenities] = useState<number[]>(() => {
        const raw = filters.amenities;

        if (!raw) {
            return [];
        }

        const arr = Array.isArray(raw) ? raw : String(raw).split(',');

        return arr.map((value) => Number(value)).filter((value) => !Number.isNaN(value));
    });

    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

    const locationRef = useRef<HTMLDivElement>(null);
    const dateRef = useRef<HTMLDivElement>(null);

    // Returns the translated text for the given translation key.
    const t = (id: string, values?: Record<string, string | number>) =>
        intl.formatMessage({ id }, values);

    const locale = intl.locale || 'de';

    const toggleAmenity = (utilityId: number) => {
        setAmenities((previousAmenities) =>
            previousAmenities.includes(utilityId)
                ? previousAmenities.filter((amenity) => amenity !== utilityId)
                : [...previousAmenities, utilityId],
        );
    };

    // Group utilities by category for the filter display.
    const utilitiesByCategory = utilities.reduce<Record<string, Utility[]>>((acc, util) => {
        const category = util.utility_category ?? util.utilityCategory;
        const categoryName = getLocalizedText(
            category?.category_name,
            t('home.filter.otherCategory'),
            locale,
        );

        if (!acc[categoryName]) {
            acc[categoryName] = [];
        }

        acc[categoryName].push(util);

        return acc;
    }, {});

    useEffect(() => {
        const handleClick = (event: MouseEvent) => {
            if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }

            if (dateRef.current && !dateRef.current.contains(event.target as Node)) {
                setShowDatePicker(false);
            }
        };

        document.addEventListener('mousedown', handleClick);

        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const suggestions = LOCATION_SUGGESTIONS.filter((suggestion) =>
        search && suggestion.toLowerCase().includes(search.toLowerCase()),
    );

    const handleSearch = () => {
        router.get('/', {
            search,
            type,
            date: selectedDate,
            start_time: startTime,
            end_time: endTime,
            amenities: amenities.join(','),
        }, { preserveState: true, replace: true });

        setShowSuggestions(false);
    };

    const handleReset = () => {
        // Only reset room type and utilities. Location and date filters remain unchanged.
        setType('');
        setAmenities([]);

        router.get('/', {
            search,
            date: selectedDate,
            start_time: startTime,
            end_time: endTime,
        }, { preserveState: true, replace: true });
    };

    const formatDateDisplay = () => {
        if (!selectedDate) {
            return '';
        }

        const date = new Date(selectedDate);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');

        return `${day}.${month}. | ${startTime} – ${endTime}`;
    };

    const visibleDeskrls = deskrls.slice(0, visibleCount);

    return (
        <>
            <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] bg-gradient-to-br from-[#5555ff] via-[#8833ff] to-[#e63cff] py-20 px-4 mb-8">
                <div className="max-w-5xl mx-auto text-center">
                    <h1 className="text-5xl md:text-6xl font-extrabold text-white text-center mb-10">
                        {t('home.hero.titleLine1')}
                        <br />
                        {t('home.hero.titleLine2')}
                    </h1>

                    <div className="bg-white rounded-2xl shadow-2xl p-6 text-left">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="relative" ref={locationRef}>
                                <label className="text-xs font-bold text-gray-800 uppercase tracking-wide block mb-2">
                                    {t('home.search.where')}
                                </label>

                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" aria-hidden="true" />

                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(event) => {
                                            setSearch(event.target.value);
                                            setShowSuggestions(true);
                                        }}
                                        onFocus={() => setShowSuggestions(true)}
                                        onKeyDown={(event) => event.key === 'Enter' && handleSearch()}
                                        placeholder={t('home.search.locationPlaceholder')}
                                        className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5555ff] text-gray-900"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSearch('Wien, 2. Bezirk');
                                            setShowSuggestions(false);
                                        }}
                                        aria-label={t('home.search.locationSuggestionAria')}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5555ff]"
                                    >
                                        <Position className="h-5 w-5" aria-hidden="true" />
                                    </button>
                                </div>

                                {showSuggestions && suggestions.length > 0 && (
                                    <div className="absolute z-20 w-full bg-white border border-gray-200 rounded-xl shadow-lg mt-1">
                                        {suggestions.map((suggestion) => (
                                            <button
                                                key={suggestion}
                                                type="button"
                                                onClick={() => {
                                                    setSearch(suggestion);
                                                    setShowSuggestions(false);
                                                }}
                                                className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-2 text-gray-900 text-sm"
                                            >
                                                <MapPin className="h-4 w-4 text-gray-400" aria-hidden="true" />
                                                {suggestion}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="relative" ref={dateRef}>
                                <label className="text-xs font-bold text-gray-800 uppercase tracking-wide block mb-2">
                                    {t('home.search.when')}
                                </label>

                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" aria-hidden="true" />

                                    <input
                                        type="text"
                                        value={formatDateDisplay()}
                                        onClick={() => setShowDatePicker(!showDatePicker)}
                                        readOnly
                                        placeholder={t('home.search.datePlaceholder')}
                                        className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5555ff] text-gray-900 cursor-pointer"
                                    />

                                    {selectedDate && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSelectedDate('');
                                                setStartTime('09:00');
                                                setEndTime('17:00');
                                                setShowDatePicker(false);
                                            }}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            aria-label={t('home.search.resetDateAria')}
                                        >
                                            <Xmark className="h-5 w-5" aria-hidden="true" />
                                        </button>
                                    )}
                                </div>

                                {showDatePicker && (
                                    <div className="absolute z-20 left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-2xl mt-1 p-4">
                                        <p className="text-xs text-gray-500 text-center mb-3">
                                            {t('home.datePicker.description')}
                                        </p>

                                        <DatePicker
                                            selectedDate={selectedDate}
                                            onDateSelect={setSelectedDate}
                                            minDate={new Date().toISOString().split('T')[0]}
                                            isRange={false}
                                        />

                                        <div className="border-t pt-3 mt-3">
                                            <p className="text-sm font-bold text-gray-700 mb-2">
                                                {t('home.datePicker.time')}
                                            </p>

                                            <div className="flex items-center gap-3">
                                                <div className="flex-1">
                                                    <label className="text-xs text-gray-500">
                                                        {t('home.datePicker.from')}
                                                    </label>

                                                    <input
                                                        type="time"
                                                        value={startTime}
                                                        onChange={(event) => setStartTime(event.target.value)}
                                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-[#5555ff]"
                                                    />
                                                </div>

                                                <span className="text-gray-400 mt-5">–</span>

                                                <div className="flex-1">
                                                    <label className="text-xs text-gray-500">
                                                        {t('home.datePicker.to')}
                                                    </label>

                                                    <input
                                                        type="time"
                                                        value={endTime}
                                                        onChange={(event) => setEndTime(event.target.value)}
                                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-[#5555ff]"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => setShowDatePicker(false)}
                                            className="w-full mt-4 bg-[#5555ff] hover:bg-[#4444ee] text-white py-2.5 rounded-xl font-bold transition"
                                        >
                                            {t('home.datePicker.done')}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-[1fr_auto] gap-3 mt-5">
                            <button
                                type="button"
                                onClick={handleSearch}
                                className="bg-[#e63cff] hover:bg-[#d12ee6] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition"
                            >
                                <Search className="h-5 w-5" aria-hidden="true" />
                                {t('home.search.button')}
                            </button>

                            <button
                                type="button"
                                onClick={() => setFilterOpen(true)}
                                className="border-2 border-gray-200 px-6 py-4 rounded-xl font-semibold flex items-center gap-2 hover:bg-gray-50 transition"
                            >
                                <FilterList className="h-5 w-5" aria-hidden="true" />
                                {t('home.filter.button')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-8 py-4">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-3xl font-bold">
                            {t('home.results.title')}
                        </h2>

                        <p className="text-gray-500 mt-1">
                            {t('home.results.count', { count: deskrls.length })}
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => setViewMode('grid')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition ${viewMode === 'grid' ? 'bg-[#5555ff] text-white' : 'border border-gray-200 hover:bg-gray-50'}`}
                        >
                            <LayoutRight className="h-4 w-4" aria-hidden="true" />
                            {t('home.view.list')}
                        </button>

                        <button
                            type="button"
                            onClick={() => setViewMode('map')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition ${viewMode === 'map' ? 'bg-[#5555ff] text-white' : 'border border-gray-200 hover:bg-gray-50'}`}
                        >
                            <Map className="h-4 w-4" aria-hidden="true" />
                            {t('home.view.map')}
                        </button>
                    </div>
                </div>

                {viewMode === 'grid' ? (
                    <>
                        {deskrls.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                {visibleDeskrls.map((deskrl) => (
                                    <DeskrlCard
                                        key={deskrl.id}
                                        deskrl={deskrl}
                                        onLoginRequired={() => {
                                            setAuthModalMode('login');
                                            setShowAuthModal(true);
                                        }}
                                    />
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-400 text-center py-16 text-lg">
                                {t('home.results.empty')}
                            </p>
                        )}

                        {deskrls.length > visibleCount && (
                            <div className="flex justify-center mt-10">
                                <button
                                    type="button"
                                    onClick={() => setVisibleCount(visibleCount + 6)}
                                    className="px-8 py-3 bg-[#5555ff] hover:bg-[#4444ee] text-white rounded-xl font-bold transition shadow-md hover:shadow-lg"
                                >
                                    {t('home.results.showMore')}
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="relative w-full h-[600px] bg-gray-100 rounded-2xl overflow-hidden border border-gray-200 shadow-lg">
                        <img
                            src="https://images.unsplash.com/photo-1567821574299-c1010c3d04a2?w=1200"
                            alt={t('home.map.alt')}
                            className="w-full h-full object-cover"
                        />

                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-sm px-6 py-3 rounded-full shadow-xl border border-gray-200">
                            <p className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <Map className="h-4 w-4 text-[#5555ff]" aria-hidden="true" />
                                {t('home.map.summary', { count: deskrls.length })}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {filterOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-black/40 z-40"
                        onClick={() => setFilterOpen(false)}
                    />

                    <div className="fixed top-0 right-0 h-full w-full md:w-[420px] bg-white z-50 shadow-2xl flex flex-col">
                        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                            <h2 className="text-2xl font-bold">
                                {t('home.filter.title')}
                            </h2>

                            <button
                                type="button"
                                onClick={() => setFilterOpen(false)}
                                aria-label={t('home.filter.close')}
                                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100"
                            >
                                <Xmark className="w-6 h-6" aria-hidden="true" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto px-6 py-6">
                            <div className="mb-8">
                                <h3 className="text-lg font-bold mb-4">
                                    {t('home.filter.roomTypeTitle')}
                                </h3>

                                <div className="space-y-3">
                                    {ROOM_TYPES.map((roomType) => (
                                        <label
                                            key={roomType.value}
                                            className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl hover:border-[#5555ff] cursor-pointer transition-colors"
                                        >
                                            <input
                                                type="checkbox"
                                                className="sr-only"
                                                checked={type === roomType.value}
                                                onChange={() => setType(type === roomType.value ? '' : roomType.value)}
                                            />

                                            <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all flex-shrink-0 ${type === roomType.value ? 'bg-[#5555ff] border-[#5555ff]' : 'border-gray-300'}`}>
                                                {type === roomType.value && (
                                                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                )}
                                            </div>

                                            <span className="font-semibold">
                                                {t(roomType.labelKey)}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-lg font-bold mb-4">
                                    {t('home.filter.amenitiesTitle')}
                                </h3>

                                {Object.keys(utilitiesByCategory).length === 0 && (
                                    <p className="text-sm text-gray-400">
                                        {t('home.filter.noAmenities')}
                                    </p>
                                )}

                                {Object.entries(utilitiesByCategory).map(([categoryName, items]) => (
                                    <div key={categoryName}>
                                        <div className="flex items-center gap-2 mb-3">
                                            <DatabaseMonitor className="h-4 w-4 text-[#5555ff]" aria-hidden="true" />

                                            <h4 className="text-base font-bold text-[#5555ff]">
                                                {categoryName}
                                            </h4>
                                        </div>

                                        <div className="space-y-3 mb-6">
                                            {items.map((util) => {
                                                const label = getLocalizedText(
                                                    util.name,
                                                    t('home.card.utilityFallback'),
                                                    locale,
                                                );
                                                const checked = amenities.includes(util.id);

                                                return (
                                                    <label
                                                        key={util.id}
                                                        className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl hover:border-[#5555ff] cursor-pointer transition-colors"
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            className="sr-only"
                                                            checked={checked}
                                                            onChange={() => toggleAmenity(util.id)}
                                                        />

                                                        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all flex-shrink-0 ${checked ? 'bg-[#5555ff] border-[#5555ff]' : 'border-gray-300'}`}>
                                                            {checked && (
                                                                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                                </svg>
                                                            )}
                                                        </div>

                                                        <div className="w-6 h-6 flex items-center justify-center">
                                                            {getUtilityIcon(label)}
                                                        </div>

                                                        <span className="font-semibold text-sm">
                                                            {label}
                                                        </span>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="border-t border-gray-200 px-6 py-4 flex gap-3 bg-white">
                            <button
                                type="button"
                                onClick={handleReset}
                                className="flex-1 px-6 py-3 border-2 border-gray-200 rounded-xl font-semibold hover:border-gray-300 transition"
                            >
                                {t('home.filter.reset')}
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    handleSearch();
                                    setFilterOpen(false);
                                }}
                                className="flex-1 px-6 py-3 bg-[#5555ff] hover:bg-[#4444ee] text-white rounded-xl font-bold transition"
                            >
                                {t('home.filter.apply')}
                            </button>
                        </div>
                    </div>
                </>
            )}

            <AuthModal
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
                initialMode={authModalMode}
            />
        </>
    );
};

Home.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>;

export default Home;
