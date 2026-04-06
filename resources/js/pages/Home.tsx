import AppLayout from '@/Layouts/AppLayout';
import type { InertiaPage } from '@/types/inertia';
import { useState } from 'react';

const PLACEHOLDER_IMAGES: Record<string, string> = {
    office: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
    seminar: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80',
    coworking: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&q=80',
    workspace: 'https://images.unsplash.com/photo-1505330622279-bf7d7fc918f4?w=800&q=80',
    event: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
};

const TYPE_LABEL: Record<string, string> = {
    office: 'Büro',
    seminar: 'Seminar',
    coworking: 'Coworking',
    workspace: 'Workspace',
    event: 'Event',
};

function ListingCard({ listing }: { listing: any }) {
    const [favorited, setFavorited] = useState(false);
    const img = PLACEHOLDER_IMAGES[listing.type] ?? PLACEHOLDER_IMAGES.office;

    return (
        <div className="bg-white rounded-2xl shadow hover:shadow-md transition overflow-hidden flex flex-col">
            {/* Image */}
            <div className="relative">
                <img src={img} alt={listing.title} className="w-full h-48 object-cover" />
                <button
                    onClick={() => setFavorited(!favorited)}
                    className="absolute top-3 left-3 bg-white rounded-full p-2 shadow"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${favorited ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} fill="none">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                </button>
                <span className="absolute top-3 right-3 bg-white text-sm font-medium px-3 py-1 rounded-full shadow">
                    {TYPE_LABEL[listing.type] ?? listing.type}
                </span>
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col gap-2 flex-1">
                <h2 className="font-bold text-base">{listing.title}</h2>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    Wien · Kapazität: {listing.capacity}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                    <span className="text-xs border border-blue-300 text-blue-600 rounded-full px-2 py-0.5">WLAN</span>
                    <span className="text-xs border border-blue-300 text-blue-600 rounded-full px-2 py-0.5">Kaffee</span>
                    <span className="text-xs border border-blue-300 text-blue-600 rounded-full px-2 py-0.5">+2</span>
                </div>

                {/* Price & Rating */}
                <div className="flex items-center justify-between mt-auto pt-2">
                    <span className="text-blue-600 font-bold text-lg">€{listing.price_hourly}<span className="text-sm font-normal text-gray-500">/Stunde</span></span>
                    <span className="text-sm text-gray-500 flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400 fill-yellow-400" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                        5.0
                    </span>
                </div>
            </div>
        </div>
    );
}

const Home: InertiaPage<{ listings: any[] }> = ({ listings }) => {
    return (
        <>
            <h1 className="text-2xl font-bold px-8 pt-8 pb-4">Verfügbare Spaces</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-8 pb-8">
                {listings.map((listing) => (
                    <ListingCard key={listing.id} listing={listing} />
                ))}
            </div>
        </>
    );
};

Home.layout = page => <AppLayout>{page}</AppLayout>;
export default Home;
