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
    Car, Parking, EvPlugCharging, Bicycle, Flash,
    Gamepad, Tree, VideoProjector
} from 'iconoir-react';
import { useState, useRef, useEffect } from 'react';

const PLACEHOLDER_IMAGES: Record<string, string> = {
    office: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
    seminar: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80',
    coworking: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&q=80',
    workspace: 'https://images.unsplash.com/photo-1505330622279-bf7d7fc918f4?w=800&q=80',
    event: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
};

const TYPE_LABEL: Record<string, string> = {
    office: 'Besprechungsraum',
    seminar: 'Seminarraum',
    coworking: 'Co-Working Platz',
    workspace: 'Arbeitsplatz',
    event: 'Eventlocation',
};

const LOCATION_SUGGESTIONS = [
    'Wien, 1. Bezirk',
    'Wien, 2. Bezirk',
    'Wien, 3. Bezirk',
    'Wien, 9. Bezirk',
    'Wieselburg',
    'Wiener Neustadt',
];

function ListingCard({ listing, onLoginRequired }: { listing: any; onLoginRequired: () => void }) {
    const { isFavorited, toggleFavorite } = useFavorites();
    const img = PLACEHOLDER_IMAGES[listing.type] ?? PLACEHOLDER_IMAGES.office;

    const { props } = usePage();
    const { auth } = props as any;
    const isLoggedIn = !!auth?.user;

    const handleFavorite = () => {
        if (!isLoggedIn) {
            onLoginRequired();
            return;
        }
        toggleFavorite(listing.id);
    };

    return (
        <div className="bg-white rounded-2xl shadow hover:shadow-xl transition-all overflow-hidden flex flex-col border border-gray-100 group">
            <div className="relative h-56 overflow-hidden">
                <img src={img} alt={listing.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                <button
                    onClick={handleFavorite}
                    className="absolute top-4 left-4 bg-white rounded-full p-2 shadow"
                >
                    {isFavorited(listing.id)
                        ? <HeartSolid className="h-4 w-4 text-red-500" />
                        : <Heart className="h-4 w-4 text-gray-400" />
                    }
                </button>
                <span className="absolute top-4 right-4 bg-white text-sm font-semibold px-3 py-1 rounded-full shadow">
                    {TYPE_LABEL[listing.type] ?? listing.type}
                </span>
            </div>
            <div className="p-6 flex flex-col gap-2 flex-1">
                <h2 className="font-bold text-xl">{listing.title}</h2>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {listing.address?.city ?? 'Wien'}{listing.address?.street ? ' · ' + listing.address.street : ''}
                </p>
                <div className="flex flex-wrap gap-2 mb-2">
                    <span className="text-xs bg-[#f5f5ff] text-[#5555ff] rounded-full px-3 py-1 font-semibold">WLAN</span>
                    <span className="text-xs bg-[#f5f5ff] text-[#5555ff] rounded-full px-3 py-1 font-semibold">Kaffee</span>
                    <span className="text-xs bg-[#f5f5ff] text-[#5555ff] rounded-full px-3 py-1 font-semibold">Bildschirm</span>
                    <span className="text-xs bg-gray-100 text-gray-600 rounded-full px-3 py-1 font-semibold">+2</span>
                </div>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                    <span className="text-[#5555ff] font-bold text-2xl">
                        <>€{listing.price_per_hour ? (listing.price_per_hour / 100).toFixed(0) : '?'}<span className="text-sm font-normal text-gray-500">/Stunde</span></>
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

const Home: InertiaPage<{ listings: any[]; filters: { search?: string; type?: string; date?: string; start_time?: string; end_time?: string } }> = ({ listings, filters }) => {
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
    const toggleAmenity = (label: string) => {
        setAmenities(prev =>
            prev.includes(label) ? prev.filter(a => a !== label) : [...prev, label]
        );
    };

    const locationRef = useRef<HTMLDivElement>(null);
    const dateRef = useRef<HTMLDivElement>(null);

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
        router.get('/', {}, { preserveState: true, replace: true });
    };

    const formatDateDisplay = () => {
        if (!selectedDate) return '';
        const date = new Date(selectedDate);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        return `${day}.${month}. | ${startTime} – ${endTime}`;
    };

    const visibleListings = listings.slice(0, visibleCount);

    return (
        <>
            {/* Hero */}
            <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] bg-gradient-to-br from-[#5555ff] via-[#8833ff] to-[#e63cff] py-20 px-4 mb-8">
                <div className="max-w-5xl mx-auto text-center">
                    <h1 className="text-5xl md:text-6xl font-extrabold text-white text-center mb-10">
                        So viel freier Raum!<br />Nutze ihn!
                    </h1>

                    <div className="bg-white rounded-2xl shadow-2xl p-6 text-left">
                        <div className="grid md:grid-cols-2 gap-4">

                            {/* Wo */}
                            <div className="relative" ref={locationRef}>
                                <label className="text-xs font-bold text-gray-800 uppercase tracking-wide block mb-2">Wo</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={e => { setSearch(e.target.value); setShowSuggestions(true); }}
                                        onFocus={() => setShowSuggestions(true)}
                                        onKeyDown={e => e.key === 'Enter' && handleSearch()}
                                        placeholder="Ort eingeben..."
                                        className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5555ff] text-gray-900"
                                    />
                                    <button
                                        onClick={() => { setSearch('Wien, 2. Bezirk'); setShowSuggestions(false); }}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5555ff]"
                                    >
                                        <Position className="h-5 w-5" />
                                    </button>
                                </div>

                                {showSuggestions && suggestions.length > 0 && (
                                    <div className="absolute z-20 w-full bg-white border border-gray-200 rounded-xl shadow-lg mt-1">
                                        {suggestions.map((s, i) => (
                                            <button key={i} onClick={() => { setSearch(s); setShowSuggestions(false); }}
                                                    className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-2 text-gray-900 text-sm">
                                                <MapPin className="h-4 w-4 text-gray-400" />{s}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/*//aktuell grad nur visuell - noch keine verknüpfung mit der verfügbarkeitstabelle*/}
                            {/* Wann */}
                            <div className="relative" ref={dateRef}>
                                <label className="text-xs font-bold text-gray-800 uppercase tracking-wide block mb-2">Wann</label>
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
                                        <p className="text-xs text-gray-500 text-center mb-3">Wähle einen Tag oder einen Zeitraum</p>
                                        <DatePicker
                                            selectedDate={selectedDate}
                                            onDateSelect={setSelectedDate}
                                            minDate={new Date().toISOString().split('T')[0]}
                                            isRange={false}
                                        />
                                        <div className="border-t pt-3 mt-3">
                                            <p className="text-sm font-bold text-gray-700 mb-2">Uhrzeit</p>
                                            <div className="flex items-center gap-3">
                                                <div className="flex-1">
                                                    <label className="text-xs text-gray-500">Von</label>
                                                    <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)}
                                                           className="w-full border border-gray-200 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-[#5555ff]" />
                                                </div>
                                                <span className="text-gray-400 mt-5">–</span>
                                                <div className="flex-1">
                                                    <label className="text-xs text-gray-500">Bis</label>
                                                    <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)}
                                                           className="w-full border border-gray-200 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-[#5555ff]" />
                                                </div>
                                            </div>
                                        </div>
                                        <button onClick={() => setShowDatePicker(false)}
                                                className="w-full mt-4 bg-[#5555ff] hover:bg-[#4444ee] text-white py-2.5 rounded-xl font-bold transition">
                                            Fertig
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-[1fr_auto] gap-3 mt-5">
                            <button onClick={handleSearch}
                                    className="bg-[#e63cff] hover:bg-[#d12ee6] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition">
                                <Search className="h-5 w-5" /> Suchen
                            </button>
                            <button onClick={() => setFilterOpen(true)}
                                    className="border-2 border-gray-200 px-6 py-4 rounded-xl font-semibold flex items-center gap-2 hover:bg-gray-50 transition">
                                <FilterList className="h-5 w-5" /> Filter
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Ergebnisse */}
            <div className="max-w-7xl mx-auto px-8 py-4">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-3xl font-bold">Verfügbare Räume</h2>
                        <p className="text-gray-500 mt-1">{listings.length} Räume gefunden</p>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => setViewMode('grid')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition ${viewMode === 'grid' ? 'bg-[#5555ff] text-white' : 'border border-gray-200 hover:bg-gray-50'}`}>
                            <LayoutRight className="h-4 w-4" /> Liste
                        </button>
                        <button onClick={() => setViewMode('map')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition ${viewMode === 'map' ? 'bg-[#5555ff] text-white' : 'border border-gray-200 hover:bg-gray-50'}`}>
                            <Map className="h-4 w-4" /> Karte
                        </button>
                    </div>
                </div>

                {viewMode === 'grid' ? (
                    <>
                        {listings.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                {visibleListings.map(listing => (
                                    <ListingCard
                                        key={listing.id}
                                        listing={listing}
                                        onLoginRequired={() => setShowLoginPopup(true)}
                                    />
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-400 text-center py-16 text-lg">Keine Räume gefunden.</p>
                        )}

                        {listings.length > visibleCount && (
                            <div className="flex justify-center mt-10">
                                <button onClick={() => setVisibleCount(visibleCount + 6)}
                                        className="px-8 py-3 bg-[#5555ff] hover:bg-[#4444ee] text-white rounded-xl font-bold transition shadow-md hover:shadow-lg">
                                    Mehr anzeigen
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="relative w-full h-[600px] bg-gray-100 rounded-2xl overflow-hidden border border-gray-200 shadow-lg">
                        <img src="https://images.unsplash.com/photo-1567821574299-c1010c3d04a2?w=1200"
                             alt="Kartenansicht Wien" className="w-full h-full object-cover" />
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-sm px-6 py-3 rounded-full shadow-xl border border-gray-200">
                            <p className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <Map className="h-4 w-4 text-[#5555ff]" />
                                Kartenansicht • {listings.length} Räume
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Login Popup */}
            {showLoginPopup && (
                <>
                    <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setShowLoginPopup(false)} />
                    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl z-50 p-8 w-full max-w-md">
                        <button onClick={() => setShowLoginPopup(false)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                            <Xmark className="w-5 h-5" />
                        </button>
                        <div className="text-center mb-6">
                            <span className="text-4xl">😊</span>
                            <h2 className="text-2xl font-bold mt-3 mb-1">Willkommen zurück!</h2>
                            <p className="text-gray-500 text-sm">Melden Sie sich an, um fortzufahren</p>
                            <p className="text-[#5555ff] font-semibold text-sm mt-1">Willkommen bei Deskrl</p>
                        </div>
                        <div className="flex flex-col gap-3">
                            <input type="email"
                                   value={loginEmail}
                                   onChange={e => setLoginEmail(e.target.value)}
                                   placeholder="ihre@email.com"
                                   className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#5555ff]" />

                            <input type="password"
                                   value={loginPassword}
                                   onChange={e => setLoginPassword(e.target.value)}
                                   placeholder="••••••••"
                                   className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#5555ff]" />

                            <button
                                onClick={() => {
                                    router.post('/login', {
                                        email: loginEmail,
                                        password: loginPassword
                                    }, {
                                        onSuccess: () => setShowLoginPopup(false)
                                    });
                                }}
                                className="w-full bg-[#e63cff] hover:bg-[#d12ee6] text-white py-3 rounded-xl font-bold transition mt-2">
                                Anmelden
                            </button>
                            <div className="flex items-center gap-3 my-1">
                                <div className="flex-1 h-px bg-gray-200" />
                                <span className="text-xs text-gray-400">Oder fortfahren mit</span>
                                <div className="flex-1 h-px bg-gray-200" />
                            </div>
                            <button className="w-full border border-gray-200 py-3 rounded-xl font-semibold flex items-center justify-center gap-3 hover:bg-gray-50 transition">
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                </svg>
                                Mit Google fortfahren
                            </button>

                            <button className="w-full border border-gray-200 py-3 rounded-xl font-semibold flex items-center justify-center gap-3 hover:bg-gray-50 transition">
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                </svg>
                                Mit Facebook fortfahren
                            </button>

                            <button className="w-full border border-gray-200 py-3 rounded-xl font-semibold flex items-center justify-center gap-3 hover:bg-gray-50 transition">
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                                </svg>
                                Mit Apple fortfahren
                            </button>
                            <p className="text-center text-sm mt-2">
                                <button
                                    onClick={() => {
                                        setShowLoginPopup(false);
                                        setAuthModalMode('register');
                                        setTimeout(() => setShowAuthModal(true), 10);
                                    }}
                                    className="text-[#5555ff] font-semibold hover:underline">
                                    Noch kein Konto? Jetzt registrieren
                                </button>
                            </p>
                        </div>
                    </div>
                </>
            )}
            {/* Filter Sidebar */}
            {filterOpen && (
                <>
                    <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setFilterOpen(false)} />
                    <div className="fixed top-0 right-0 h-full w-full md:w-[420px] bg-white z-50 shadow-2xl flex flex-col">
                        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                            <h2 className="text-2xl font-bold">Filter</h2>
                            <button onClick={() => setFilterOpen(false)}
                                    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100">
                                <Xmark className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto px-6 py-6">
                            <div className="mb-8">
                                <h3 className="text-lg font-bold mb-4">Raumart</h3>
                                <div className="space-y-3">
                                    {Object.entries(TYPE_LABEL).map(([value, label]) => (
                                        <label key={value} className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl hover:border-[#5555ff] cursor-pointer transition-colors">
                                            <input type="checkbox" className="sr-only"
                                                   checked={type === value}
                                                   onChange={() => setType(type === value ? '' : value)} />
                                            <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all flex-shrink-0 ${type === value ? 'bg-[#5555ff] border-[#5555ff]' : 'border-gray-300'}`}>
                                                {type === value && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
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
                                    <h4 className="text-base font-bold text-[#5555ff]">Technik & Arbeitsausstattung</h4>
                                </div>
                                <div className="space-y-3 mb-6">
                                    {[
                                        { label: 'Drucker / Kopierer', icon: <Printer className="h-4 w-4 text-[#5555ff]" /> },
                                        { label: 'Beamer', icon: <VideoProjector className="h-4 w-4 text-[#5555ff]" /> },
                                        { label: 'Beamer Full HD', icon: <VideoProjector className="h-4 w-4 text-[#5555ff]" /> },
                                        { label: 'Beamer 4K', icon: <VideoProjector className="h-4 w-4 text-[#5555ff]" /> },
                                        { label: '2x 27" Bildschirme', icon: <DatabaseMonitor className="h-4 w-4 text-[#5555ff]" /> },
                                        { label: '2x 24" Bildschirme', icon: <DatabaseMonitor className="h-4 w-4 text-[#5555ff]" /> },
                                        { label: '3x 55" Bildschirme', icon: <DatabaseMonitor className="h-4 w-4 text-[#5555ff]" /> },
                                        { label: '65" Touch-Bildschirm', icon: <DatabaseMonitor className="h-4 w-4 text-[#5555ff]" /> },
                                        { label: 'Tastatur & Maus', icon: <KeyCommand className="h-4 w-4 text-[#5555ff]" /> },
                                        { label: 'USB-C Docking-Station', icon: <PlugTypeC className="h-4 w-4 text-[#5555ff]" /> },
                                        { label: 'Flipchart & Pinnwand', icon: <PasteClipboard className="h-4 w-4 text-[#5555ff]" /> },
                                        { label: 'Flipchart & Whiteboard', icon: <PasteClipboard className="h-4 w-4 text-[#5555ff]" /> },
                                        { label: '8 Stromanschlüsse', icon: <Flash className="h-4 w-4 text-[#5555ff]" /> },
                                        { label: '12 Stromanschlüsse', icon: <Flash className="h-4 w-4 text-[#5555ff]" /> },
                                    ].map(item => (
                                        <label key={item.label} className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl hover:border-[#5555ff] cursor-pointer transition-colors">
                                            <input type="checkbox" className="sr-only"
                                                   checked={amenities.includes(item.label)}
                                                   onChange={() => toggleAmenity(item.label)} />
                                            <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all flex-shrink-0 ${amenities.includes(item.label) ? 'bg-[#5555ff] border-[#5555ff]' : 'border-gray-300'}`}>
                                                {amenities.includes(item.label) && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                            </div>
                                            <div className="w-6 h-6 flex items-center justify-center">{item.icon}</div>
                                            <span className="font-semibold text-sm">{item.label}</span>
                                        </label>
                                    ))}
                                </div>

                                <div className="flex items-center gap-2 mb-3">
                                    <CoffeeCup className="h-4 w-4 text-[#5555ff]" />
                                    <h4 className="text-base font-bold text-[#5555ff]">Komfort & Infrastruktur</h4>
                                </div>
                                <div className="space-y-3 mb-6">
                                    {[
                                        { label: 'WC', icon: <HomeIcon className="h-4 w-4 text-[#5555ff]" /> },
                                        { label: 'Dusche', icon: <Bathroom className="h-4 w-4 text-[#5555ff]" /> },
                                        { label: 'Schließfächer', icon: <Lock className="h-4 w-4 text-[#5555ff]" /> },
                                        { label: 'Aufzug', icon: <Elevator className="h-4 w-4 text-[#5555ff]" /> },
                                        { label: 'Haustierfreundlich', icon: <Building className="h-4 w-4 text-[#5555ff]" /> },
                                        { label: 'Nichtraucher', icon: <Building className="h-4 w-4 text-[#5555ff]" /> },
                                        { label: 'Kaffee inkludiert', icon: <CoffeeCup className="h-4 w-4 text-[#5555ff]" /> },
                                        { label: 'Snackautomat', icon: <CoffeeCup className="h-4 w-4 text-[#5555ff]" /> },
                                        { label: 'Catering-Service', icon: <CoffeeCup className="h-4 w-4 text-[#5555ff]" /> },
                                        { label: 'Vollausgestattete Küche', icon: <CoffeeCup className="h-4 w-4 text-[#5555ff]" /> },
                                    ].map(item => (
                                        <label key={item.label} className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl hover:border-[#5555ff] cursor-pointer transition-colors">
                                            <input type="checkbox" className="sr-only"
                                                   checked={amenities.includes(item.label)}
                                                   onChange={() => toggleAmenity(item.label)} />
                                            <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all flex-shrink-0 ${amenities.includes(item.label) ? 'bg-[#5555ff] border-[#5555ff]' : 'border-gray-300'}`}>
                                                {amenities.includes(item.label) && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                            </div>
                                            <div className="w-6 h-6 flex items-center justify-center">{item.icon}</div>
                                            <span className="font-semibold text-sm">{item.label}</span>
                                        </label>
                                    ))}
                                </div>

                                <div className="flex items-center gap-2 mb-3">
                                    <Bicycle className="h-4 w-4 text-[#5555ff]" />
                                    <h4 className="text-base font-bold text-[#5555ff]">Mobilität & Lage</h4>
                                </div>
                                <div className="space-y-3 mb-6">
                                    {[
                                        { label: 'Fahrradabstellplatz', icon: <Bicycle className="h-4 w-4 text-[#5555ff]" /> },
                                        { label: 'E-Bike Ladestation', icon: <EvPlugCharging className="h-4 w-4 text-[#5555ff]" /> },
                                        { label: 'Zentrale Lage', icon: <MapPin className="h-4 w-4 text-[#5555ff]" /> },
                                        { label: 'U-Bahn 2 Min', icon: <MapPin className="h-4 w-4 text-[#5555ff]" /> },
                                        { label: '3 Parkplätze', icon: <Parking className="h-4 w-4 text-[#5555ff]" /> },
                                        { label: '5 Parkplätze', icon: <Parking className="h-4 w-4 text-[#5555ff]" /> },
                                    ].map(item => (
                                        <label key={item.label} className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl hover:border-[#5555ff] cursor-pointer transition-colors">
                                            <input type="checkbox" className="sr-only"
                                                   checked={amenities.includes(item.label)}
                                                   onChange={() => toggleAmenity(item.label)} />
                                            <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all flex-shrink-0 ${amenities.includes(item.label) ? 'bg-[#5555ff] border-[#5555ff]' : 'border-gray-300'}`}>
                                                {amenities.includes(item.label) && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                            </div>
                                            <div className="w-6 h-6 flex items-center justify-center">{item.icon}</div>
                                            <span className="font-semibold text-sm">{item.label}</span>
                                        </label>
                                    ))}
                                </div>

                                <div className="flex items-center gap-2 mb-3">
                                    <Gamepad className="h-4 w-4 text-[#5555ff]" />
                                    <h4 className="text-base font-bold text-[#5555ff]">Extras & Freizeit</h4>
                                </div>
                                <div className="space-y-3">
                                    {[
                                        { label: 'Tischfußball', icon: <Gamepad className="h-4 w-4 text-[#5555ff]" /> },
                                        { label: 'Terrasse', icon: <Tree className="h-4 w-4 text-[#5555ff]" /> },
                                        { label: 'Garten', icon: <Tree className="h-4 w-4 text-[#5555ff]" /> },
                                    ].map(item => (
                                        <label key={item.label} className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl hover:border-[#5555ff] cursor-pointer transition-colors">
                                            <input type="checkbox" className="sr-only"
                                                   checked={amenities.includes(item.label)}
                                                   onChange={() => toggleAmenity(item.label)} />
                                            <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all flex-shrink-0 ${amenities.includes(item.label) ? 'bg-[#5555ff] border-[#5555ff]' : 'border-gray-300'}`}>
                                                {amenities.includes(item.label) && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                            </div>
                                            <div className="w-6 h-6 flex items-center justify-center">{item.icon}</div>
                                            <span className="font-semibold text-sm">{item.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 px-6 py-4 flex gap-3 bg-white">
                            <button onClick={handleReset}
                                    className="flex-1 px-6 py-3 border-2 border-gray-200 rounded-xl font-semibold hover:border-gray-300 transition">
                                Zurücksetzen
                            </button>
                            <button onClick={() => { handleSearch(); setFilterOpen(false); }}
                                    className="flex-1 px-6 py-3 bg-[#5555ff] hover:bg-[#4444ee] text-white rounded-xl font-bold transition">
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
