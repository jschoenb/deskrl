import React, { useState, useEffect } from "react";
import { Link, router, usePage } from '@inertiajs/react';
import { Home, Calendar, LayoutGrid, User, LogOut, Heart, Menu, X, Building2, Globe } from 'lucide-react';
import { useFavorites } from '@/contexts/FavoritesContext';
import AuthModal from './AuthModal';
import { CommercialVerificationModal } from '@/Pages/Profile/CommercialVerificationModal';

export default function Header() {
    const { url, props } = usePage();
    const { auth } = props as any;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isCommercialVerificationModalOpen, setIsCommercialVerificationModalOpen] = useState(false);

    const { favorites, clearFavorites } = useFavorites();

    // Read the account type from the shared Inertia auth props.
    const accountType = auth?.user?.account_type ?? auth?.user?.role;

    // Check whether the logged-in account already has a provider role.
    const isHost =
        accountType === 'private_host' ||
        accountType === 'commercial_host' ||
        accountType === 'host';

    // Build a readable display name for the profile link.
    const displayName = auth?.user
        ? `${auth.user.first_name ?? ''} ${auth.user.last_name ?? ''}`.trim() || auth.user.email
        : '';

    // Log out the current user and clear local favorite state.
    const handleLogout = () => {
        clearFavorites();
        setIsMobileMenuOpen(false);

        router.post(
            '/logout',
            {},
            {
                replace: true,
                preserveState: false,
                preserveScroll: false,
            },
        );
    };

    // Returns true if the given path matches the current URL.
    // Exact matching prevents parent routes like "/provider" from staying active on "/provider/bookings".
    const isActive = (path: string, exact = false) => {
        if (path === '/' || exact) {
            return url === path;
        }

        return url === path || url.startsWith(path + '/');
    };

    // Returns Tailwind classes for desktop navigation links.
    const navLinkClass = (path: string, exact = false) =>
        `flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            isActive(path, exact)
                ? 'bg-[#5555ff] text-white'
                : 'hover:bg-gray-100 text-gray-700'
        }`;

    // Returns Tailwind classes for mobile navigation links.
    const mobileNavLinkClass = (path: string, exact = false) =>
        `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            isActive(path, exact)
                ? 'bg-[#5555ff] text-white'
                : 'hover:bg-gray-100 text-gray-900'
        }`;

    // Close the mobile menu whenever the current route changes.
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [url]);

    // Lock body scroll while the mobile drawer is open.
    useEffect(() => {
        document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isMobileMenuOpen]);

    // Language dropdown for the header.
    // Currently only German is available. More languages can be added later.
    const LanguageDropdown = () => {
        const [isOpen, setIsOpen] = useState(false);
        const currentLanguage = 'DE';

        return (
            <div className="relative">
                <button
                    type="button"
                    onClick={() => setIsOpen((open) => !open)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-700 font-medium"
                    aria-haspopup="listbox"
                    aria-expanded={isOpen}
                >
                    <Globe className="w-5 h-5" />
                    <span>{currentLanguage}</span>
                    <span className="text-xs text-gray-400">▾</span>
                </button>

                {isOpen && (
                    <div className="absolute right-0 mt-2 w-40 rounded-xl border border-gray-200 bg-white shadow-lg z-50 overflow-hidden">
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-[#5555ff] bg-[#f5f5ff]"
                        >
                            <span>Deutsch</span>
                            <span>DE</span>
                        </button>

                        {/* Add more languages here later, for example English. */}
                    </div>
                )}
            </div>
        );
    };

    return (
        <>
            <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">

                        {/* Brand logo */}
                        <Link
                            href="/"
                            className="inline-flex items-center"
                            aria-label="Zur Startseite"
                        >
                            <img
                                src="/images/deskrl-logo.svg"
                                alt="deskrl"
                                className="h-20 w-auto"
                            />
                        </Link>

                        {/* ── Desktop nav links (right-aligned) ──────────── */}
                        <div className="hidden lg:flex items-center gap-2">

                            {/* Nav links */}
                            {isHost ? (
                                <>
                                    <Link href="/provider" className={navLinkClass('/provider',true)}>
                                        <LayoutGrid className="w-5 h-5" />
                                        <span className="font-medium">Meine Räume</span>
                                    </Link>
                                    <Link href="/provider/bookings" className={navLinkClass('/provider/bookings')}>
                                        <Calendar className="w-5 h-5" />
                                        <span className="font-medium">Buchungen</span>
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link href="/" className={navLinkClass('/')}>
                                        <Home className="w-5 h-5" />
                                        <span className="font-medium">Suchen</span>
                                    </Link>
                                    <Link href="/bookings" className={navLinkClass('/bookings')}>
                                        <Calendar className="w-5 h-5" />
                                        <span className="font-medium">Buchungen</span>
                                    </Link>
                                    <Link href="/favorites" className={`relative ${navLinkClass('/favorites')}`}>
                                        <Heart className={`w-5 h-5 ${isActive('/favorites') ? 'fill-white' : ''}`} />
                                        <span className="font-medium">Gemerkte</span>
                                        {favorites.length > 0 && (
                                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#e63cff] text-white text-xs rounded-full flex items-center justify-center font-bold">
                                                {favorites.length}
                                            </span>
                                        )}
                                    </Link>
                                </>
                            )}

                            {/* Language selector */}
                            <LanguageDropdown />

                            {/* Divider between navigation links and auth area */}
                            <div className="mx-2 h-6 w-px bg-gray-200" />

                            {/* Auth area */}
                            {auth?.user ? (
                                <>
                                    {/* Provider upgrade button is hidden for existing providers. */}
                                    {!isHost && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsMobileMenuOpen(false);
                                                setIsCommercialVerificationModalOpen(true);
                                            }}
                                            className="flex items-center gap-3 rounded-lg bg-[#e63cff] px-4 py-3 font-semibold text-white transition-colors hover:bg-[#d12ee6]"
                                        >
                                            <Building2 className="h-5 w-5" />
                                            <span>Werde Anbieter</span>
                                        </button>
                                    )}
                                    <Link href="/profile" className={navLinkClass('/profile')}>
                                        <User className="h-5 w-5" />
                                        <span className="font-medium">{displayName}</span>
                                    </Link>
                                    <div>Banana</div>
                                    <button
                                        type="button"
                                        className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100"
                                        onClick={handleLogout}
                                    >
                                        <LogOut className="h-5 w-5" />
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => setIsAuthModalOpen(true)}
                                    className="flex items-center gap-2 rounded-lg bg-[#e63cff] px-6 py-2 font-semibold text-white transition-colors hover:bg-[#d12ee6]"
                                >
                                    <User className="h-5 w-5" />
                                    Anmelden
                                </button>
                            )}
                        </div>

                        {/* ── Mobile burger button ────────────────────────── */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            aria-label="Menü öffnen"
                        >
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* ── Mobile backdrop – clicking it closes the drawer ─────────── */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* ── Mobile drawer (slides in from the right) ────────────────── */}
            <div className={`fixed top-20 right-0 bottom-0 w-80 bg-white shadow-xl z-40 transform transition-transform duration-300 ease-in-out lg:hidden ${
                isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}>
                <div className="flex flex-col h-full overflow-y-auto p-6 gap-3">

                    {isHost ? (
                        // Provider links in mobile drawer
                        <>
                            <Link href="/provider" className={mobileNavLinkClass('/provider', true)}>
                                <LayoutGrid className="w-5 h-5" />
                                <span className="font-semibold">Meine Räume</span>
                            </Link>
                            <Link href="/provider/bookings" className={mobileNavLinkClass('/provider/bookings')}>
                                <Calendar className="w-5 h-5" />
                                <span className="font-semibold">Buchungen</span>
                            </Link>
                        </>
                    ) : (
                        // Regular user links in mobile drawer
                        <>
                            <Link href="/" className={mobileNavLinkClass('/')}>
                                <Home className="w-5 h-5" />
                                <span className="font-semibold">Suchen</span>
                            </Link>
                            <Link href="/bookings" className={mobileNavLinkClass('/bookings')}>
                                <Calendar className="w-5 h-5" />
                                <span className="font-semibold">Buchungen</span>
                            </Link>
                            <Link href="/favorites" className={`relative ${mobileNavLinkClass('/favorites')}`}>
                                <Heart className={`w-5 h-5 ${isActive('/favorites') ? 'fill-white' : ''}`} />
                                <span className="font-semibold">Gemerkte</span>
                                {/* Favorites badge in mobile drawer */}
                                {favorites.length > 0 && (
                                    <span className="ml-auto w-6 h-6 bg-[#e63cff] text-white text-xs rounded-full flex items-center justify-center font-bold">
                                        {favorites.length}
                                    </span>
                                )}
                            </Link>
                        </>
                    )}

                    <div className="border-t border-gray-200 my-2" />

                    {/* Language selector in mobile drawer */}
                    <div className="px-2">
                        <LanguageDropdown />
                    </div>

                    <div className="border-t border-gray-200 my-2" />

                    {auth?.user ? (
                        <>
                            {/* Provider upgrade button is hidden for existing providers. */}
                            {!isHost && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsMobileMenuOpen(false);
                                        setIsCommercialVerificationModalOpen(true);
                                    }}
                                    className="flex items-center gap-2 rounded-lg bg-[#e63cff] px-4 py-2 font-semibold text-white transition-colors hover:bg-[#d12ee6]"
                                >
                                    <Building2 className="h-5 w-5" />
                                    <span>Werde Anbieter</span>
                                </button>
                            )}
                            <Link href="/profile" className={mobileNavLinkClass('/profile')}>
                                <User className="h-5 w-5" />
                                <span className="font-semibold">{displayName}</span>
                            </Link>
                            <button
                                type="button"
                                className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-gray-900 hover:bg-gray-100"
                                onClick={handleLogout}
                            >
                                <LogOut className="w-5 h-5" />
                                <span className="font-semibold">Abmelden</span>
                            </button>
                        </>
                    ) : (
                        // Not logged in – login button also closes the drawer first
                        <button
                            type="button"
                            onClick={() => {
                                setIsMobileMenuOpen(false);
                                setIsAuthModalOpen(true);
                            }}
                            className="flex items-center justify-center gap-3 rounded-lg bg-[#e63cff] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#d12ee6]"
                        >
                            <User className="w-5 h-5" />
                            Anmelden
                        </button>
                    )}
                </div>
            </div>

            {/* Provider upgrade modal */}
            <CommercialVerificationModal
                isOpen={isCommercialVerificationModalOpen}
                onClose={() => setIsCommercialVerificationModalOpen(false)}
            />

            {/* Auth modal for login and registration */}
            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
            />
        </>
    );
}
