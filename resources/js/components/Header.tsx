import { useEffect, useState } from 'react';
import {
    Home,
    Calendar,
    LayoutGrid,
    User,
    LogOut,
    Heart,
    Menu,
    X,
    Building2,
    Globe,
} from 'lucide-react';
import { Link, router, usePage } from '@inertiajs/react';

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

    // Lock page scrolling while the mobile drawer is open.
    useEffect(() => {
        document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';

        return () => {
            document.body.style.overflow = '';
        };
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
                    className="flex items-center gap-2 rounded-lg px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-100"
                    aria-haspopup="listbox"
                    aria-expanded={isOpen}
                >
                    <Globe className="h-5 w-5" />
                    <span>{currentLanguage}</span>
                    <span className="text-xs text-gray-400">▾</span>
                </button>

                {isOpen && (
                    <div className="absolute right-0 z-50 mt-2 w-40 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="flex w-full items-center justify-between bg-[#f5f5ff] px-4 py-3 text-sm font-semibold text-[#5555ff]"
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
            <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-20 items-center justify-between">
                        {/* Logo */}
                        <Link href="/">
                            <span className="text-2xl font-bold tracking-tighter text-blue-900">
                                deskrl
                            </span>
                        </Link>

                        {/* Desktop navigation */}
                        <div className="hidden items-center gap-2 lg:flex">
                            {isHost ? (
                                <>
                                    {/* Provider dashboard link uses exact matching so it is not active on provider subpages. */}
                                    <Link href="/provider" className={navLinkClass('/provider', true)}>
                                        <LayoutGrid className="h-5 w-5" />
                                        <span className="font-medium">Meine Räume</span>
                                    </Link>

                                    {/* Provider bookings link uses exact matching for clear tab highlighting. */}
                                    <Link
                                        href="/provider/bookings"
                                        className={navLinkClass('/provider/bookings', true)}
                                    >
                                        <Calendar className="h-5 w-5" />
                                        <span className="font-medium">Buchungen</span>
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link href="/" className={navLinkClass('/')}>
                                        <Home className="h-5 w-5" />
                                        <span className="font-medium">Suchen</span>
                                    </Link>

                                    <Link href="/bookings" className={navLinkClass('/bookings')}>
                                        <Calendar className="h-5 w-5" />
                                        <span className="font-medium">Buchungen</span>
                                    </Link>

                                    <Link href="/favorites" className={`relative ${navLinkClass('/favorites')}`}>
                                        <Heart
                                            className={`h-5 w-5 ${
                                                isActive('/favorites') ? 'fill-white' : ''
                                            }`}
                                        />

                                        <span className="font-medium">Gemerkte</span>

                                        {favorites.length > 0 && (
                                            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#e63cff] text-xs font-bold text-white">
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

                            {/* Desktop auth area */}
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

                                    <button
                                        type="button"
                                        className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100"
                                        onClick={handleLogout}
                                        aria-label="Abmelden"
                                    >
                                        <LogOut className="h-5 w-5" />
                                    </button>
                                </>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => setIsAuthModalOpen(true)}
                                    className="flex items-center gap-2 rounded-lg bg-[#e63cff] px-6 py-2 font-semibold text-white transition-colors hover:bg-[#d12ee6]"
                                >
                                    <User className="h-5 w-5" />
                                    Anmelden
                                </button>
                            )}
                        </div>

                        {/* Mobile burger button */}
                        <button
                            type="button"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="rounded-lg p-2 transition-colors hover:bg-gray-100 lg:hidden"
                            aria-label="Menü öffnen"
                        >
                            {isMobileMenuOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile backdrop */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Mobile drawer */}
            <div
                className={`fixed bottom-0 right-0 top-20 z-40 w-80 transform bg-white shadow-xl transition-transform duration-300 ease-in-out lg:hidden ${
                    isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                <div className="flex h-full flex-col gap-3 overflow-y-auto p-6">
                    {isHost ? (
                        <>
                            {/* Provider dashboard link uses exact matching so it is not active on provider subpages. */}
                            <Link href="/provider" className={mobileNavLinkClass('/provider', true)}>
                                <LayoutGrid className="h-5 w-5" />
                                <span className="font-semibold">Meine Räume</span>
                            </Link>

                            {/* Provider bookings link uses exact matching for clear tab highlighting. */}
                            <Link
                                href="/provider/bookings"
                                className={mobileNavLinkClass('/provider/bookings', true)}
                            >
                                <Calendar className="h-5 w-5" />
                                <span className="font-semibold">Buchungen</span>
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link href="/" className={mobileNavLinkClass('/')}>
                                <Home className="h-5 w-5" />
                                <span className="font-semibold">Suchen</span>
                            </Link>

                            <Link href="/bookings" className={mobileNavLinkClass('/bookings')}>
                                <Calendar className="h-5 w-5" />
                                <span className="font-semibold">Buchungen</span>
                            </Link>

                            <Link href="/favorites" className={`relative ${mobileNavLinkClass('/favorites')}`}>
                                <Heart
                                    className={`h-5 w-5 ${
                                        isActive('/favorites') ? 'fill-white' : ''
                                    }`}
                                />

                                <span className="font-semibold">Gemerkte</span>

                                {/* Favorites badge in mobile drawer */}
                                {favorites.length > 0 && (
                                    <span className="ml-auto flex h-6 w-6 items-center justify-center rounded-full bg-[#e63cff] text-xs font-bold text-white">
                                        {favorites.length}
                                    </span>
                                )}
                            </Link>
                        </>
                    )}

                    <div className="my-2 border-t border-gray-200" />

                    {/* Language selector in mobile drawer */}
                    <div className="px-2">
                        <LanguageDropdown />
                    </div>

                    <div className="my-2 border-t border-gray-200" />

                    {/* Mobile auth area */}
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
                                <LogOut className="h-5 w-5" />
                                <span className="font-semibold">Abmelden</span>
                            </button>
                        </>
                    ) : (
                        <button
                            type="button"
                            onClick={() => {
                                setIsMobileMenuOpen(false);
                                setIsAuthModalOpen(true);
                            }}
                            className="flex items-center justify-center gap-3 rounded-lg bg-[#e63cff] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#d12ee6]"
                        >
                            <User className="h-5 w-5" />
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
