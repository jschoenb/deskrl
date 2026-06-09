import AppLayout from '@/Layouts/AppLayout';
import { InertiaPage } from '@/types/inertia';
import { useFavorites } from '@/contexts/FavoritesContext';
import AuthModal from '@/components/AuthModal';
import { MapPin, Heart, HeartSolid } from 'iconoir-react';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

const PLACEHOLDER_IMAGE =
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80';

type LocalizedText = string | {
    de?: string;
    en?: string;
};

interface DeskrlImage {
    id: number;
    path: string;
    is_main?: boolean;
    sort_order?: number;
}

interface DeskrlUtility {
    id: number;
    name: LocalizedText;
    pivot?: {
        quantity?: number | null;
    };
}

interface DeskrlAddressRelation {
    address?: {
        city?: string;
        street?: string;
        house_nr?: string;
        postal_code?: string;
    };
}

interface DeskrlCategory {
    id: number;
    name: LocalizedText;
}

interface Deskrl {
    id: number;
    title: LocalizedText;
    description?: LocalizedText;
    price_per_hour?: number | string | null;
    deskrl_category?: DeskrlCategory;
    deskrlCategory?: DeskrlCategory;
    deskrl_address?: DeskrlAddressRelation;
    deskrlAddress?: DeskrlAddressRelation;
    images?: DeskrlImage[];
    utilities?: DeskrlUtility[];
}

function getLocalizedText(value: LocalizedText | undefined | null, fallback = ''): string {
    if (!value) {
        return fallback;
    }

    if (typeof value === 'string') {
        try {
            const parsed = JSON.parse(value);

            return parsed?.de ?? parsed?.en ?? value;
        } catch {
            return value;
        }
    }

    return value.de ?? value.en ?? fallback;
}

function getCategoryName(deskrl: Deskrl): string {
    const category = deskrl.deskrl_category ?? deskrl.deskrlCategory;

    return getLocalizedText(category?.name, 'Deskrl');
}

function getAddress(deskrl: Deskrl) {
    return deskrl.deskrl_address?.address
        ?? deskrl.deskrlAddress?.address
        ?? null;
}

function getMainImage(deskrl: Deskrl): string {
    const mainImage = deskrl.images?.find((image) => image.is_main) ?? deskrl.images?.[0];

    if (!mainImage?.path) {
        return PLACEHOLDER_IMAGE;
    }

    if (mainImage.path.startsWith('http')) {
        return mainImage.path;
    }

    return `/storage/${mainImage.path}`;
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

const Favorites: InertiaPage<{ deskrls: Deskrl[] }> = ({ deskrls = [] }) => {
    const { favorites, toggleFavorite } = useFavorites();
    const { props } = usePage();
    const { auth } = props as any;

    const isLoggedIn = !!auth?.user;
    const [showAuthModal, setShowAuthModal] = useState(false);

    // Only logged-in users see their saved Deskrls from the database state.
    const favoritedDeskrls = deskrls.filter((deskrl) => favorites.includes(deskrl.id));

    if (!isLoggedIn) {
        return (
            <>
                <div className="min-h-[70vh] bg-white flex items-center justify-center px-4">
                    <div className="text-center max-w-md">
                        <div className="w-20 h-20 bg-[#f5f5ff] rounded-full flex items-center justify-center mx-auto mb-6">
                            <Heart className="w-10 h-10 text-[#5555ff]" />
                        </div>

                        <h1 className="text-3xl font-bold mb-4 text-gray-900">
                            Meine Gemerkten
                        </h1>

                        <p className="text-gray-600 mb-6">
                            Melde dich an, um deine gemerkten Deskrls dauerhaft zu speichern und später wiederzufinden.
                        </p>

                        <button
                            type="button"
                            onClick={() => setShowAuthModal(true)}
                            className="inline-block bg-[#5555ff] hover:bg-[#4444ee] text-white px-8 py-3 rounded-xl transition-colors font-bold"
                        >
                            Jetzt anmelden
                        </button>
                    </div>
                </div>

                <AuthModal
                    isOpen={showAuthModal}
                    onClose={() => setShowAuthModal(false)}
                    initialMode="login"
                />
            </>
        );
    }

    return (
        <>
            {/* Header */}
            <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] bg-gradient-to-br from-[#5555ff] via-[#7575ff] to-[#e63cff] text-white py-16 px-4 mb-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-3 mb-4">
                        <HeartSolid className="w-8 h-8 text-white" />

                        <h1 className="text-4xl md:text-5xl font-extrabold">
                            Meine Gemerkten
                        </h1>
                    </div>

                    <p className="text-white/90 text-lg">
                        {favoritedDeskrls.length === 0
                            ? 'Noch keine Räume gespeichert'
                            : `${favoritedDeskrls.length} ${favoritedDeskrls.length === 1 ? 'Raum' : 'Räume'} gespeichert`}
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 pb-12">
                {favoritedDeskrls.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Heart className="w-12 h-12 text-gray-400" />
                        </div>

                        <h2 className="text-2xl font-bold mb-4 text-gray-900">
                            Noch keine Favoriten
                        </h2>

                        <p className="text-gray-600 mb-8">
                            Klicke auf das Herz bei einem Raum, um ihn hier zu speichern.
                        </p>

                        <Link
                            href="/"
                            className="inline-block bg-[#5555ff] hover:bg-[#4444ee] text-white px-8 py-3 rounded-xl transition-colors font-bold"
                        >
                            Räume entdecken
                        </Link>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {favoritedDeskrls.map((deskrl) => {
                            const title = getLocalizedText(deskrl.title, 'Ohne Titel');
                            const category = getCategoryName(deskrl);
                            const address = getAddress(deskrl);
                            const image = getMainImage(deskrl);
                            const utilities = deskrl.utilities ?? [];

                            return (
                                <div
                                    key={deskrl.id}
                                    className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100"
                                >
                                    <div className="relative h-56 overflow-hidden">
                                        <img
                                            src={image}
                                            alt={title}
                                            onError={(event) => {
                                                event.currentTarget.src = PLACEHOLDER_IMAGE;
                                            }}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                        />

                                        {/* Favorite button */}
                                        <button
                                            type="button"
                                            onClick={() => toggleFavorite(deskrl.id)}
                                            className="absolute top-4 right-4 bg-[#e63cff] rounded-full p-2 shadow"
                                        >
                                            <HeartSolid className="h-5 w-5 text-white" />
                                        </button>

                                        <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full text-sm font-semibold">
                                            {category}
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        <h3 className="text-xl font-bold mb-2">
                                            {title}
                                        </h3>

                                        <p className="text-gray-600 text-sm mb-4 flex items-center gap-1">
                                            <MapPin className="w-4 h-4" />
                                            {address?.city ?? 'Ort unbekannt'}
                                            {address?.street ? `, ${address.street}` : ''}
                                        </p>

                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {utilities.length > 0 ? (
                                                <>
                                                    {utilities.slice(0, 3).map((utility) => (
                                                        <span
                                                            key={utility.id}
                                                            className="px-3 py-1 bg-[#f5f5ff] text-[#5555ff] rounded-full text-xs font-semibold"
                                                        >
                                                            {getLocalizedText(utility.name, 'Ausstattung')}
                                                            {utility.pivot?.quantity
                                                                ? ` (${utility.pivot.quantity})`
                                                                : ''}
                                                        </span>
                                                    ))}

                                                    {utilities.length > 3 && (
                                                        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold">
                                                            +{utilities.length - 3}
                                                        </span>
                                                    )}
                                                </>
                                            ) : (
                                                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold">
                                                    Keine Ausstattung angegeben
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                            <div>
                                                <span className="text-2xl font-bold text-[#5555ff]">
                                                    €{formatPrice(deskrl.price_per_hour)}
                                                </span>

                                                <span className="text-gray-600 text-sm">
                                                    /Stunde
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-1">
                                                <span className="text-yellow-500">★</span>
                                                <span className="font-semibold">4.5</span>
                                                <span className="text-gray-500 text-sm">(127)</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </>
    );
};

Favorites.layout = page => <AppLayout>{page}</AppLayout>;

export default Favorites;
