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
    Printer, DatabaseMonitor, KeyCommand, PlugTypeC, PasteClipboard,
    CoffeeCup, Home as HomeIcon, Bathroom, Lock, Building, Elevator,
    Parking, EvPlugCharging, Bicycle, Flash,
    Gamepad, Tree, VideoProjector
} from 'iconoir-react';
import { useState, useRef, useEffect } from 'react';

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

type HomeProps = {
    deskrls: Deskrl[];
    filters?: {
        search?: string;
        type?: string;
        date?: string;
        start_time?: string;
        end_time?: string;
    };
};

function getLocalizedText(value: LocalizedText | undefined | null, fallback = ''): string {
    if (!value) {
        return fallback;
    }

    if (typeof value === 'string') {
        try {
            const parsed = JSON.parse(value);

            if (typeof parsed === 'object' && parsed !== null) {
                return parsed.de ?? parsed.en ?? fallback;
            }

            return value;
        } catch {
            return value;
        }
    }

    return value.de ?? value.en ?? fallback;
}

function getCategoryName(deskrl: Deskrl): string {
    return deskrl.deskrl_category?.name
        ?? deskrl.deskrlCategory?.name
        ?? 'Deskrl';
}

function getAddress(deskrl: Deskrl) {
    return deskrl.deskrl_address?.address
        ?? deskrl.deskrlAddress?.address
        ?? null;
}

function getMainImage(deskrl: Deskrl): string {
    const mainImage = deskrl.images?.find(image => image.is_main) ?? deskrl.images?.[0];

    if (!mainImage?.path) {
        return PLACEHOLDER_IMAGES.default;
    }

    if (mainImage.path.startsWith('http')) {
        return mainImage.path;
    }

    return `/storage/${mainImage.path}`;
}

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
    const { isFavorited, toggleFavorite } = useFavorites();

    const { props } = usePage();
    const { auth } = props as any;
    const isLoggedIn = !!auth?.user;

    const title = getLocalizedText(deskrl.title, 'Ohne Titel');
    const category = getCategoryName(deskrl);
    const address = getAddress(deskrl);
    const imageFromDb = getMainImage(deskrl);
    const fallbackImage = getPlaceholderByCategory(category);
    const utilities = deskrl.utilities ?? [];

    const handleFavorite = () => {
        if (!isLoggedIn) {
            onLoginRequired();
            return;
        }

        toggleFavorite(deskrl.id);
    };

    return (
        <div className="bg-white rounded-2xl shadow hover:shadow-xl transition-all overflow-hidden flex flex-col border border-gray-100 group">
            <div className="relative h-56 overflow-hidden">
                <img
                    src={imageFromDb}
                    alt={title}
                    onError={event => {
                        event.currentTarget.src = fallbackImage;
                    }}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />

                <button
                    onClick={handleFavorite}
                    className="absolute top-4 left-4 bg-white rounded-full p-2 shadow"
                >
                    {isFavorited(deskrl.id)
                        ? <HeartSolid className="h-4 w-4 text-red-500" />
                        : <Heart className="h-4 w-4 text-gray-400" />
                    }
                </button>

                <span className="absolute top-4 right-4 bg-white text-sm font-semibold px-3 py-1 rounded-full shadow">
                    {category}
                </span>
            </div>

            <div className="p-6 flex flex-col gap-2 flex-1">
                <h2 className="font-bold text-xl">{title}</h2>

                <p className="text-sm text-gray-500 flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {address?.city ?? 'Ort unbekannt'}
                    {address?.street ? ` · ${address.street}` : ''}
                </p>

                <div className="flex flex-wrap gap-2 mb-2">
                    {utilities.length > 0 ? (
                        <>
                            {utilities.slice(0, 3).map(utility => (
                                <span
                                    key={utility.id}
                                    className="text-xs bg-[#f5f5ff] text-[#5555ff] rounded-full px-3 py-1 font-semibold"
                                >
                                    {getLocalizedText(utility.name, 'Ausstattung')}
                                    {utility.pivot?.quantity ? ` (${utility.pivot.quantity})` : ''}
                                </span>
                            ))}

                            {utilities.length > 3 && (
                                <span className="text-xs bg-gray-100 text-gray-600 rounded-full px-3 py-1 font-semibold">
                                    +{utilities.length - 3}
                                </span>
                            )}
                        </>
                    ) : (
                        <span className="text-xs bg-gray-100 text-gray-600 rounded-full px-3 py-1 font-semibold">
                            Keine Ausstattung angegeben
                        </span>
                    )}
                </div>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                    <span className="text-[#5555ff] font-bold text-2xl">
                        €{formatPrice(deskrl.price_per_hour)}
                        <span className="text-sm font-normal text-gray-500">/Stunde</span>
                    </span>

                    <span className="text-sm text-gray-900 flex items-center gap-1">
                        <span className="text-yellow-400 text-lg">★</span>
                        <span className="font-semibold">4.5</span>
                        <span className="text-gray-500">(127)</span>
                    </span>
                </div>
            </div>
        </div>
    );
}

const Home: InertiaPage<HomeProps> = ({ deskrls = [], filters = {} }) => {
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
    const [amenities, setAmenities] = useState<string[]>([]);
    const [showLoginPopup, setShowLoginPopup] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    const locationRef = useRef<HTMLDivElement>(null);
    const dateRef = useRef<HTMLDivElement>(null);

    const toggleAmenity = (label: string) => {
        setAmenities(prev =>
            prev.includes(label) ? prev.filter(a => a !== label) : [...prev, label]
        );
    };

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (locationRef.current && !locationRef.current.contains(e.target as Node)) {
                setShowSuggestions(false);
            }

            if (dateRef.current && !dateRef.current.contains(e.target as Node)) {
                setShowDatePicker(false);
            }
        };

        document.addEventListener('mousedown', handleClick);

        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const suggestions = LOCATION_SUGGESTIONS.filter(s =>
        search && s.toLowerCase().includes(search.toLowerCase())
    );

    const handleSearch = () => {
        router.get('/', {
            search,
            type,
            date: selectedDate,
            start_time: startTime,
            end_time: endTime,
        }, { preserveState: true, replace: true });

        setShowSuggestions(false);
    };

    const handleReset = () => {
        setSearch('');
        setType('');
        setSelectedDate('');
        setStartTime('09:00');
        setEndTime('17:00');
        setAmenities([]);

        router.get('/', {}, { preserveState: true, replace: true });
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
                        So viel freier Raum!<br />Nutze ihn!
                    </h1>

                    <div className="bg-white rounded-2xl shadow-2xl p-6 text-left">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="relative" ref={locationRef}>
                                <label className="text-xs font-bold text-gray-800 uppercase tracking-wide block mb-2">
                                    Wo
                                </label>

                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />

                                    <input
                                        type="text"
                                        value={search}
                                        onChange={e => {
                                            setSearch(e.target.value);
                                            setShowSuggestions(true);
                                        }}
                                        onFocus={() => setShowSuggestions(true)}
                                        onKeyDown={e => e.key === 'Enter' && handleSearch()}
                                        placeholder="Ort eingeben..."
                                        className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5555ff] text-gray-900"
                                    />

                                    <button
                                        onClick={() => {
                                            setSearch('Wien, 2. Bezirk');
                                            setShowSuggestions(false);
                                        }}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5555ff]"
                                    >
                                        <Position className="h-5 w-5" />
                                    </button>
                                </div>

                                {showSuggestions && suggestions.length > 0 && (
                                    <div className="absolute z-20 w-full bg-white border border-gray-200 rounded-xl shadow-lg mt-1">
                                        {suggestions.map((s, i) => (
                                            <button
                                                key={i}
                                                onClick={() => {
                                                    setSearch(s);
                                                    setShowSuggestions(false);
                                                }}
                                                className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-2 text-gray-900 text-sm"
                                            >
                                                <MapPin className="h-4 w-4 text-gray-400" />
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="relative" ref={dateRef}>
                                <label className="text-xs font-bold text-gray-800 uppercase tracking-wide block mb-2">
                                    Wann
                                </label>

                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />

                                    <input
                                        type="text"
                                        value={formatDateDisplay()}
                                        onClick={() => setShowDatePicker(!showDatePicker)}
                                        readOnly
                                        placeholder="Datum & Zeit wählen..."
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5555ff] text-gray-900 cursor-pointer"
                                    />
                                </div>

                                {showDatePicker && (
                                    <div className="absolute z-20 left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-2xl mt-1 p-4">
                                        <p className="text-xs text-gray-500 text-center mb-3">
                                            Wähle einen Tag oder einen Zeitraum
                                        </p>

                                        <DatePicker
                                            selectedDate={selectedDate}
                                            onDateSelect={setSelectedDate}
                                            minDate={new Date().toISOString().split('T')[0]}
                                            isRange={false}
                                        />

                                        <div className="border-t pt-3 mt-3">
                                            <p className="text-sm font-bold text-gray-700 mb-2">
                                                Uhrzeit
                                            </p>

                                            <div className="flex items-center gap-3">
                                                <div className="flex-1">
                                                    <label className="text-xs text-gray-500">
                                                        Von
                                                    </label>

                                                    <input
                                                        type="time"
                                                        value={startTime}
                                                        onChange={e => setStartTime(e.target.value)}
                                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-[#5555ff]"
                                                    />
                                                </div>

                                                <span className="text-gray-400 mt-5">–</span>

                                                <div className="flex-1">
                                                    <label className="text-xs text-gray-500">
                                                        Bis
                                                    </label>

                                                    <input
                                                        type="time"
                                                        value={endTime}
                                                        onChange={e => setEndTime(e.target.value)}
                                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-[#5555ff]"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => setShowDatePicker(false)}
                                            className="w-full mt-4 bg-[#5555ff] hover:bg-[#4444ee] text-white py-2.5 rounded-xl font-bold transition"
                                        >
                                            Fertig
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-[1fr_auto] gap-3 mt-5">
                            <button
                                onClick={handleSearch}
                                className="bg-[#e63cff] hover:bg-[#d12ee6] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition"
                            >
                                <Search className="h-5 w-5" />
                                Suchen
                            </button>

                            <button
                                onClick={() => setFilterOpen(true)}
                                className="border-2 border-gray-200 px-6 py-4 rounded-xl font-semibold flex items-center gap-2 hover:bg-gray-50 transition"
                            >
                                <FilterList className="h-5 w-5" />
                                Filter
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-8 py-4">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-3xl font-bold">Verfügbare Räume</h2>
                        <p className="text-gray-500 mt-1">
                            {deskrls.length} Räume gefunden
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition ${viewMode === 'grid' ? 'bg-[#5555ff] text-white' : 'border border-gray-200 hover:bg-gray-50'}`}
                        >
                            <LayoutRight className="h-4 w-4" />
                            Liste
                        </button>

                        <button
                            onClick={() => setViewMode('map')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition ${viewMode === 'map' ? 'bg-[#5555ff] text-white' : 'border border-gray-200 hover:bg-gray-50'}`}
                        >
                            <Map className="h-4 w-4" />
                            Karte
                        </button>
                    </div>
                </div>

                {viewMode === 'grid' ? (
                    <>
                        {deskrls.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                {visibleDeskrls.map(deskrl => (
                                    <DeskrlCard
                                        key={deskrl.id}
                                        deskrl={deskrl}
                                        onLoginRequired={() => setShowLoginPopup(true)}
                                    />
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-400 text-center py-16 text-lg">
                                Keine Räume gefunden.
                            </p>
                        )}

                        {deskrls.length > visibleCount && (
                            <div className="flex justify-center mt-10">
                                <button
                                    onClick={() => setVisibleCount(visibleCount + 6)}
                                    className="px-8 py-3 bg-[#5555ff] hover:bg-[#4444ee] text-white rounded-xl font-bold transition shadow-md hover:shadow-lg"
                                >
                                    Mehr anzeigen
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="relative w-full h-[600px] bg-gray-100 rounded-2xl overflow-hidden border border-gray-200 shadow-lg">
                        <img
                            src="https://images.unsplash.com/photo-1567821574299-c1010c3d04a2?w=1200"
                            alt="Kartenansicht Wien"
                            className="w-full h-full object-cover"
                        />

                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-sm px-6 py-3 rounded-full shadow-xl border border-gray-200">
                            <p className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <Map className="h-4 w-4 text-[#5555ff]" />
                                Kartenansicht • {deskrls.length} Räume
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {showLoginPopup && (
                <>
                    <div
                        className="fixed inset-0 bg-black/40 z-40"
                        onClick={() => setShowLoginPopup(false)}
                    />

                    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl z-50 p-8 w-full max-w-md">
                        <button
                            onClick={() => setShowLoginPopup(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            <Xmark className="w-5 h-5" />
                        </button>

                        <div className="text-center mb-6">
                            <span className="text-4xl">😊</span>
                            <h2 className="text-2xl font-bold mt-3 mb-1">
                                Willkommen zurück!
                            </h2>
                            <p className="text-gray-500 text-sm">
                                Melden Sie sich an, um fortzufahren
                            </p>
                            <p className="text-[#5555ff] font-semibold text-sm mt-1">
                                Willkommen bei Deskrl
                            </p>
                        </div>

                        <div className="flex flex-col gap-3">
                            <input
                                type="email"
                                value={loginEmail}
                                onChange={e => setLoginEmail(e.target.value)}
                                placeholder="ihre@email.com"
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#5555ff]"
                            />

                            <input
                                type="password"
                                value={loginPassword}
                                onChange={e => setLoginPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#5555ff]"
                            />

                            <button
                                onClick={() => {
                                    router.post('/login', {
                                        email: loginEmail,
                                        password: loginPassword
                                    }, {
                                        onSuccess: () => setShowLoginPopup(false)
                                    });
                                }}
                                className="w-full bg-[#e63cff] hover:bg-[#d12ee6] text-white py-3 rounded-xl font-bold transition mt-2"
                            >
                                Anmelden
                            </button>

                            <p className="text-center text-sm mt-2">
                                <button
                                    onClick={() => {
                                        setShowLoginPopup(false);
                                        setAuthModalMode('register');
                                        setTimeout(() => setShowAuthModal(true), 10);
                                    }}
                                    className="text-[#5555ff] font-semibold hover:underline"
                                >
                                    Noch kein Konto? Jetzt registrieren
                                </button>
                            </p>
                        </div>
                    </div>
                </>
            )}

            {filterOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-black/40 z-40"
                        onClick={() => setFilterOpen(false)}
                    />

                    <div className="fixed top-0 right-0 h-full w-full md:w-[420px] bg-white z-50 shadow-2xl flex flex-col">
                        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                            <h2 className="text-2xl font-bold">Filter</h2>

                            <button
                                onClick={() => setFilterOpen(false)}
                                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100"
                            >
                                <Xmark className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto px-6 py-6">
                            <div className="mb-8">
                                <h3 className="text-lg font-bold mb-4">Raumart</h3>

                                <div className="space-y-3">
                                    {['Arbeitsplatz', 'Meetingraum', 'Seminarraum', 'Coworking', 'Eventlocation'].map(label => (
                                        <label
                                            key={label}
                                            className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl hover:border-[#5555ff] cursor-pointer transition-colors"
                                        >
                                            <input
                                                type="checkbox"
                                                className="sr-only"
                                                checked={type === label}
                                                onChange={() => setType(type === label ? '' : label)}
                                            />

                                            <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all flex-shrink-0 ${type === label ? 'bg-[#5555ff] border-[#5555ff]' : 'border-gray-300'}`}>
                                                {type === label && (
                                                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                )}
                                            </div>

                                            <span className="font-semibold">{label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-lg font-bold mb-4">Ausstattung</h3>

                                <div className="flex items-center gap-2 mb-3">
                                    <DatabaseMonitor className="h-4 w-4 text-[#5555ff]" />
                                    <h4 className="text-base font-bold text-[#5555ff]">
                                        Technik & Arbeitsausstattung
                                    </h4>
                                </div>

                                <div className="space-y-3 mb-6">
                                    {[
                                        { label: 'Drucker / Kopierer', icon: <Printer className="h-4 w-4 text-[#5555ff]" /> },
                                        { label: 'Beamer', icon: <VideoProjector className="h-4 w-4 text-[#5555ff]" /> },
                                        { label: 'Bildschirm', icon: <DatabaseMonitor className="h-4 w-4 text-[#5555ff]" /> },
                                        { label: 'Tastatur & Maus', icon: <KeyCommand className="h-4 w-4 text-[#5555ff]" /> },
                                        { label: 'USB-C Docking-Station', icon: <PlugTypeC className="h-4 w-4 text-[#5555ff]" /> },
                                        { label: 'Flipchart & Whiteboard', icon: <PasteClipboard className="h-4 w-4 text-[#5555ff]" /> },
                                        { label: 'Stromanschlüsse', icon: <Flash className="h-4 w-4 text-[#5555ff]" /> },
                                    ].map(item => (
                                        <label
                                            key={item.label}
                                            className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl hover:border-[#5555ff] cursor-pointer transition-colors"
                                        >
                                            <input
                                                type="checkbox"
                                                className="sr-only"
                                                checked={amenities.includes(item.label)}
                                                onChange={() => toggleAmenity(item.label)}
                                            />

                                            <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all flex-shrink-0 ${amenities.includes(item.label) ? 'bg-[#5555ff] border-[#5555ff]' : 'border-gray-300'}`}>
                                                {amenities.includes(item.label) && (
                                                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                )}
                                            </div>

                                            <div className="w-6 h-6 flex items-center justify-center">
                                                {item.icon}
                                            </div>

                                            <span className="font-semibold text-sm">
                                                {item.label}
                                            </span>
                                        </label>
                                    ))}
                                </div>

                                <div className="flex items-center gap-2 mb-3">
                                    <CoffeeCup className="h-4 w-4 text-[#5555ff]" />
                                    <h4 className="text-base font-bold text-[#5555ff]">
                                        Komfort & Infrastruktur
                                    </h4>
                                </div>

                                <div className="space-y-3 mb-6">
                                    {[
                                        { label: 'WC', icon: <HomeIcon className="h-4 w-4 text-[#5555ff]" /> },
                                        { label: 'Dusche', icon: <Bathroom className="h-4 w-4 text-[#5555ff]" /> },
                                        { label: 'Schließfächer', icon: <Lock className="h-4 w-4 text-[#5555ff]" /> },
                                        { label: 'Aufzug', icon: <Elevator className="h-4 w-4 text-[#5555ff]" /> },
                                        { label: 'Kaffee inkludiert', icon: <CoffeeCup className="h-4 w-4 text-[#5555ff]" /> },
                                        { label: 'Küche', icon: <CoffeeCup className="h-4 w-4 text-[#5555ff]" /> },
                                    ].map(item => (
                                        <label
                                            key={item.label}
                                            className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl hover:border-[#5555ff] cursor-pointer transition-colors"
                                        >
                                            <input
                                                type="checkbox"
                                                className="sr-only"
                                                checked={amenities.includes(item.label)}
                                                onChange={() => toggleAmenity(item.label)}
                                            />

                                            <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all flex-shrink-0 ${amenities.includes(item.label) ? 'bg-[#5555ff] border-[#5555ff]' : 'border-gray-300'}`}>
                                                {amenities.includes(item.label) && (
                                                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                )}
                                            </div>

                                            <div className="w-6 h-6 flex items-center justify-center">
                                                {item.icon}
                                            </div>

                                            <span className="font-semibold text-sm">
                                                {item.label}
                                            </span>
                                        </label>
                                    ))}
                                </div>

                                <div className="flex items-center gap-2 mb-3">
                                    <Bicycle className="h-4 w-4 text-[#5555ff]" />
                                    <h4 className="text-base font-bold text-[#5555ff]">
                                        Mobilität & Lage
                                    </h4>
                                </div>

                                <div className="space-y-3 mb-6">
                                    {[
                                        { label: 'Fahrradabstellplatz', icon: <Bicycle className="h-4 w-4 text-[#5555ff]" /> },
                                        { label: 'E-Bike Ladestation', icon: <EvPlugCharging className="h-4 w-4 text-[#5555ff]" /> },
                                        { label: 'Zentrale Lage', icon: <MapPin className="h-4 w-4 text-[#5555ff]" /> },
                                        { label: 'Parkplätze', icon: <Parking className="h-4 w-4 text-[#5555ff]" /> },
                                    ].map(item => (
                                        <label
                                            key={item.label}
                                            className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl hover:border-[#5555ff] cursor-pointer transition-colors"
                                        >
                                            <input
                                                type="checkbox"
                                                className="sr-only"
                                                checked={amenities.includes(item.label)}
                                                onChange={() => toggleAmenity(item.label)}
                                            />

                                            <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all flex-shrink-0 ${amenities.includes(item.label) ? 'bg-[#5555ff] border-[#5555ff]' : 'border-gray-300'}`}>
                                                {amenities.includes(item.label) && (
                                                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                )}
                                            </div>

                                            <div className="w-6 h-6 flex items-center justify-center">
                                                {item.icon}
                                            </div>

                                            <span className="font-semibold text-sm">
                                                {item.label}
                                            </span>
                                        </label>
                                    ))}
                                </div>

                                <div className="flex items-center gap-2 mb-3">
                                    <Gamepad className="h-4 w-4 text-[#5555ff]" />
                                    <h4 className="text-base font-bold text-[#5555ff]">
                                        Extras & Freizeit
                                    </h4>
                                </div>

                                <div className="space-y-3">
                                    {[
                                        { label: 'Tischfußball', icon: <Gamepad className="h-4 w-4 text-[#5555ff]" /> },
                                        { label: 'Terrasse', icon: <Tree className="h-4 w-4 text-[#5555ff]" /> },
                                        { label: 'Garten', icon: <Tree className="h-4 w-4 text-[#5555ff]" /> },
                                    ].map(item => (
                                        <label
                                            key={item.label}
                                            className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl hover:border-[#5555ff] cursor-pointer transition-colors"
                                        >
                                            <input
                                                type="checkbox"
                                                className="sr-only"
                                                checked={amenities.includes(item.label)}
                                                onChange={() => toggleAmenity(item.label)}
                                            />

                                            <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all flex-shrink-0 ${amenities.includes(item.label) ? 'bg-[#5555ff] border-[#5555ff]' : 'border-gray-300'}`}>
                                                {amenities.includes(item.label) && (
                                                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                )}
                                            </div>

                                            <div className="w-6 h-6 flex items-center justify-center">
                                                {item.icon}
                                            </div>

                                            <span className="font-semibold text-sm">
                                                {item.label}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 px-6 py-4 flex gap-3 bg-white">
                            <button
                                onClick={handleReset}
                                className="flex-1 px-6 py-3 border-2 border-gray-200 rounded-xl font-semibold hover:border-gray-300 transition"
                            >
                                Zurücksetzen
                            </button>

                            <button
                                onClick={() => {
                                    handleSearch();
                                    setFilterOpen(false);
                                }}
                                className="flex-1 px-6 py-3 bg-[#5555ff] hover:bg-[#4444ee] text-white rounded-xl font-bold transition"
                            >
                                Anwenden
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

Home.layout = page => <AppLayout>{page}</AppLayout>;

export default Home;
