import { Link, usePage } from '@inertiajs/react';
import React, { useState, useEffect } from "react";
//Import Icons
import { Home, Calendar, LayoutGrid, User, LogOut, Heart, Menu, X } from 'lucide-react';
import { useFavorites } from '@/contexts/FavoritesContext';

//Rendering header
export default function Header() {
    const { url, props } = usePage();
    const { auth } = props as any; // Laravel/Inertia Auth Daten
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    //Check active link
    const isActive = (path: string) => url === path || (path !== '/' && url.startsWith(path));

    //Placeholder for the number of favorites (fill this in with actual data later)
    //Favoritescount wurde mit favorite.length ersetzt fuer die Anzahl der gemerkten Raeume
    const { favorites } = useFavorites();

    // Close mobile menu, if URl is changed
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [url]);

    // Prevents scrolling in the background when the mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isMobileMenuOpen]);

    return (
        <>
            <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">

                        {/* Logo */}
                        <Link href="/">
                            <span className="text-2xl font-bold tracking-tighter text-blue-900">deskrl</span>
                        </Link>

                        {/* Desktop navigation (visible at lg) */}
                        <div className="hidden lg:flex items-center gap-2">
                            <Link
                                href="/"
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                                    isActive('/') && url === '/'
                                        ? 'bg-[#5555ff] text-white'
                                        : 'hover:bg-gray-100 text-gray-700'
                                }`}
                            >
                                <Home className="w-5 h-5" />
                                <span className="font-medium">Suchen</span>
                            </Link>

                            <Link
                                href="/bookings"
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                                    isActive('/bookings')
                                        ? 'bg-[#5555ff] text-white'
                                        : 'hover:bg-gray-100 text-gray-700'
                                }`}
                            >
                                <Calendar className="w-5 h-5" />
                                <span className="font-medium">Buchungen</span>
                            </Link>

                            <Link
                                href="/favorites"
                                className={`relative flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                                    isActive('/favorites')
                                        ? 'bg-[#5555ff] text-white'
                                        : 'hover:bg-gray-100 text-gray-700'
                                }`}
                            >
                                <Heart className={`w-5 h-5 ${isActive('/favorites') ? 'fill-white' : ''}`} />
                                <span className="font-medium">Gemerkte</span>
                                {favorites.length  > 0 && (
                                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#e63cff] text-white text-xs rounded-full flex items-center justify-center font-bold">
                                        {favorites.length }
                                    </span>
                                )}
                            </Link>

                            {auth?.user?.role === 'provider' && (
                                <Link
                                    href="/provider"
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                                        isActive('/provider')
                                            ? 'bg-[#5555ff] text-white'
                                            : 'hover:bg-gray-100 text-gray-700'
                                    }`}
                                >
                                    <LayoutGrid className="w-5 h-5" />
                                    <span className="font-medium">Dashboard</span>
                                </Link>
                            )}

                            {/* User login area */}
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
                                        Anmelden
                                    </Link>
                                )}
                            </div>
                        </div>

                        {/* Mobile burger menu (visible under lg) */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile menu overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Mobile menu drawer */}
            <div
                className={`fixed top-20 right-0 bottom-0 w-80 bg-white shadow-xl z-40 transform transition-transform duration-300 ease-in-out lg:hidden ${
                    isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                <div className="flex flex-col h-full overflow-y-auto p-6">
                    <div className="flex flex-col gap-3">
                        <Link
                            href="/"
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                isActive('/') && url === '/' ? 'bg-[#5555ff] text-white' : 'hover:bg-gray-100'
                            }`}
                        >
                            <Home className="w-5 h-5" />
                            <span className="font-semibold">Suche</span>
                        </Link>

                        <Link
                            href="/bookings"
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                isActive('/bookings') ? 'bg-[#5555ff] text-white' : 'hover:bg-gray-100'
                            }`}
                        >
                            <Calendar className="w-5 h-5" />
                            <span className="font-semibold">Buchungen</span>
                        </Link>

                        <Link
                            href="/favorites"
                            className={`relative flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                isActive('/favorites') ? 'bg-[#5555ff] text-white' : 'hover:bg-gray-100'
                            }`}
                        >
                            <Heart className={`w-5 h-5 ${isActive('/favorites') ? 'fill-white' : ''}`} />
                            <span className="font-semibold">Favoriten</span>
                            {favorites.length  > 0 && (
                                <span className="ml-auto w-6 h-6 bg-[#e63cff] text-white text-xs rounded-full flex items-center justify-center font-bold">
                                    {favorites.length}
                                </span>
                            )}
                        </Link>

                        {auth?.user?.role === 'provider' && (
                            <Link
                                href="/provider"
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                    isActive('/provider') ? 'bg-[#5555ff] text-white' : 'hover:bg-gray-100'
                                }`}
                            >
                                <LayoutGrid className="w-5 h-5" />
                                <span className="font-semibold">Dashboard</span>
                            </Link>
                        )}

                        <div className="border-t border-gray-200 my-4" />

                        {auth?.user ? (
                            <>
                                <Link
                                    href="/profile"
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                        isActive('/profile') ? 'bg-[#5555ff] text-white' : 'hover:bg-gray-100'
                                    }`}
                                >
                                    <User className="w-5 h-5" />
                                    <span className="font-semibold">{auth.user.name}</span>
                                </Link>
                                <Link
                                    href="/logout"
                                    method="post"
                                    as="button"
                                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 rounded-lg transition-colors text-gray-900 w-full text-left"
                                >
                                    <LogOut className="w-5 h-5" />
                                    <span className="font-semibold">Abmelden</span>
                                </Link>
                            </>
                        ) : (
                            <Link
                                href="/login"
                                className="bg-[#e63cff] hover:bg-[#d12ee6] text-white px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-3 font-semibold"
                            >
                                <User className="w-5 h-5" />
                                Anmelden
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
