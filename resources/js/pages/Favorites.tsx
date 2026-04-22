import AppLayout from '@/Layouts/AppLayout';
import { InertiaPage } from '@/types/inertia';
import { useFavorites } from '@/contexts/FavoritesContext';
import { MapPin, Heart, HeartSolid } from 'iconoir-react';
import { Link } from '@inertiajs/react';

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

const Favorites: InertiaPage<{ listings: any[] }> = ({ listings }) => {
    const { favorites, isFavorited, toggleFavorite } = useFavorites();
    const favoritedListings = listings.filter(l => favorites.includes(l.id));

    return (
        <>{/* Hero Banner */}
            <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] bg-gradient-to-br from-[#5555ff] via-[#8833ff] to-[#e63cff] py-16 mb-8">
                <div className="max-w-7xl mx-auto px-8">
                    <div className="flex items-center gap-3 mb-2">
                        <HeartSolid className="h-8 w-8 text-white" />
                        <h1 className="text-4xl font-extrabold text-white">Meine Gemerkten</h1>
                    </div>
                    <p className="text-white/80 text-lg">{favoritedListings.length} Deskrl gemerkt</p>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-8 pb-12">
                {favoritedListings.length === 0 ? (
                    <div className="text-center py-24">
                        <HeartSolid className="h-16 w-16 text-gray-200 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-gray-400 mb-2">Noch keine Gemerkten</h2>
                        <p className="text-gray-400 mb-6">Klicke auf das Herz bei einem Raum um ihn zu speichern.</p>
                        <Link href="/"
                              className="bg-[#5555ff] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#4444ee] transition">
                            Räume entdecken
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {favoritedListings.map(listing => {
                            const img = PLACEHOLDER_IMAGES[listing.type] ?? PLACEHOLDER_IMAGES.office;
                            return (
                                <div key={listing.id} className="bg-white rounded-2xl shadow hover:shadow-xl transition-all overflow-hidden flex flex-col border border-gray-100 group">
                                    <div className="relative h-56 overflow-hidden">
                                        <img src={img} alt={listing.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                                        <button
                                            onClick={() => toggleFavorite(listing.id)}
                                            className="absolute top-4 left-4 bg-[#e63cff] rounded-full p-2 shadow"
                                        >
                                            <HeartSolid className="h-4 w-4 text-white" />
                                        </button>
                                        <span className="absolute top-4 right-4 bg-white text-sm font-semibold px-3 py-1 rounded-full shadow">
                                            {TYPE_LABEL[listing.type] ?? listing.type}
                                        </span>
                                    </div>
                                    <div className="p-6 flex flex-col gap-2 flex-1">
                                        <h2 className="font-bold text-xl">{listing.title}</h2>
                                        <p className="text-sm text-gray-500 flex items-center gap-1">
                                            <MapPin className="h-4 w-4" />
                                            {listing.address?.city ?? 'Wien'}{listing.address?.street ? ', ' + listing.address.street : ''}
                                        </p>
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            <span className="text-xs bg-[#f5f5ff] text-[#5555ff] rounded-full px-3 py-1 font-semibold">WLAN</span>
                                            <span className="text-xs bg-[#f5f5ff] text-[#5555ff] rounded-full px-3 py-1 font-semibold">Kaffee</span>
                                            <span className="text-xs bg-[#f5f5ff] text-[#5555ff] rounded-full px-3 py-1 font-semibold">Bildschirm</span>
                                            <span className="text-xs bg-gray-100 text-gray-600 rounded-full px-3 py-1 font-semibold">+2</span>
                                        </div>
                                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                                            <span className="text-[#5555ff] font-bold text-2xl">
                                                €{listing.price_per_hour ? (listing.price_per_hour / 100).toFixed(0) : '?'}<span className="text-sm font-normal text-gray-500">/Stunde</span>
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
                        })}
                    </div>
                )}
            </div>
        </>
    );
};

Favorites.layout = page => <AppLayout>{page}</AppLayout>;
export default Favorites;
