/*
import { Link } from '@inertiajs/react';
import { Button } from "@/components/ui/button";
import React from "react";

export default function Header() {
    return (
        <header className="flex items-center justify-between px-8 py-4 border-b bg-white sticky top-0 z-50">
            {/!* Logo aus Figma *!/}
            <Link href="/" className="text-xl font-bold tracking-tight text-blue-900">
                deskrl
            </Link>

            {/!* Navigation (Verlinkungen) *!/}
            <nav className="flex items-center gap-8">
                <Link href="/" className="font-bold text-xl">Search</Link>
                <Link href="/bookings" className="hover:underline">Bookings</Link>
                <Link href="/favorites" className="hover:underline">Favorites</Link>
            </nav>
        </header>
    );
}
*/

import { Link, usePage } from '@inertiajs/react';
import React from "react";
// import icons
import { Home, Calendar, Heart, User, LogOut, LayoutGrid } from 'lucide-react';

export default function Header() {
    // Inertia: usePage() to access global data like auth
    const { url, props } = usePage();
    const { auth } = props as any; // consists of user and isAuthenticated

    // Prüfen, ob ein Link aktiv ist
    const isActive = (path: string) => url === path || url.startsWith(path + '/');

    // Platzhalter für Favoriten-Anzahl (kannst du später mit echten Daten füllen)
    const favoritesCount = 0;

    return (
        <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">

                    {/* Logo Bereich */}
                    <Link href="/">
                        <span className="text-2xl font-bold tracking-tighter text-blue-900">deskrl</span>
                    </Link>

                    <div className="flex items-center gap-2">
                        {/* Suche / Home */}
                        <Link
                            href="/"
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                                isActive('/') && url === '/'
                                    ? 'bg-[#5555ff] text-white'
                                    : 'hover:bg-gray-100 text-gray-700'
                            }`}
                        >
                            <Home className="w-5 h-5" />
                            <span className="font-medium">Search</span>
                        </Link>

                        {/* Bookings */}
                        <Link
                            href="/bookings"
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                                isActive('/bookings')
                                    ? 'bg-[#5555ff] text-white'
                                    : 'hover:bg-gray-100 text-gray-700'
                            }`}
                        >
                            <Calendar className="w-5 h-5" />
                            <span className="font-medium">Bookings</span>
                        </Link>

                        {/* Favorites */}
                        <Link
                            href="/favorites"
                            className={`relative flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                                isActive('/favorites')
                                    ? 'bg-[#5555ff] text-white'
                                    : 'hover:bg-gray-100 text-gray-700'
                            }`}
                        >
                            <Heart className={`w-5 h-5 ${isActive('/favorites') ? 'fill-white' : ''}`} />
                            <span className="font-medium">Favorites</span>
                            {favoritesCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#e63cff] text-white text-xs rounded-full flex items-center justify-center font-bold">
                                    {favoritesCount}
                                </span>
                            )}
                        </Link>

                        {/* Trennlinie & Auth Bereich */}
                        <div className="ml-4 pl-4 border-l border-gray-200 flex items-center gap-3">
                            {auth?.user ? (
                                <>
                                    <Link
                                        href="/profile"
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                                            isActive('/profile')
                                                ? 'bg-[#5555ff] text-white'
                                                : 'hover:bg-gray-100 text-gray-900'
                                        }`}
                                    >
                                        <User className="w-5 h-5" />
                                        <span className="font-medium">{auth.user.name}</span>
                                    </Link>

                                    {/* Logout Button (Inertia nutzt oft POST für Logout) */}
                                    <Link
                                        href="/logout"
                                        method="post"
                                        as="button"
                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
                                    >
                                        <LogOut className="w-5 h-5" />
                                    </Link>
                                </>
                            ) : (
                                <Link
                                    href="/login"
                                    className="bg-[#e63cff] hover:bg-[#d12ee6] text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2 font-semibold"
                                >
                                    <User className="w-5 h-5" />
                                    Sign In
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
