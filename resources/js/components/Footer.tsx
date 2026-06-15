import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Mail } from 'lucide-react';
import { IconType } from 'react-icons';
import { FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa6';
import { useIntl } from 'react-intl';
import AuthModal from './AuthModal';

export default function Footer() {
    const intl = useIntl();
    const { props } = usePage();
    const { auth } = props as any;

    // Returns the translated text for the given translation key.
    const t = (id: string) => intl.formatMessage({ id });

    // Check whether a user is currently logged in.
    const isLoggedIn = Boolean(auth?.user);

    // Controls whether the login/register modal is visible.
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    // Defines the social media icons and their target URLs.
    const socialLinks: { Icon: IconType; url: string; label: string }[] = [
        { Icon: FaFacebookF, url: 'https://facebook.com', label: 'Facebook' },
        { Icon: FaInstagram, url: 'https://instagram.com', label: 'Instagram' },
        { Icon: FaLinkedinIn, url: 'https://linkedin.com', label: 'LinkedIn' },
    ];

    return (
        <footer className="bg-white border-t border-gray-200 mt-auto">
            <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
                {/* Main footer content */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8 text-left">
                    {/* User links */}
                    <div>
                        <h3 className="text-lg font-bold mb-4 text-gray-900">
                            {t('footer.users')}
                        </h3>

                        <ul className="space-y-3 text-sm">
                            <li>
                                <Link href="/faq-user" className="text-gray-600 hover:text-[#5555ff] transition-colors">
                                    {t('footer.faq')}
                                </Link>
                            </li>
                            <li>
                                <Link href="/cancellation" className="text-gray-600 hover:text-[#5555ff] transition-colors">
                                    {t('footer.cancellation')}
                                </Link>
                            </li>
                            <li>
                                <Link href="/support-user" className="text-gray-600 hover:text-[#5555ff] transition-colors">
                                    {t('footer.support')}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Provider links */}
                    <div>
                        <h3 className="text-lg font-bold mb-4 text-gray-900">
                            {t('footer.providers')}
                        </h3>

                        <ul className="space-y-3 text-sm">
                            <li>
                                {isLoggedIn ? (
                                    <Link
                                        href="/profile"
                                        className="text-gray-600 transition-colors hover:text-[#5555ff]"
                                    >
                                        {t('footer.startAsProvider')}
                                    </Link>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => setIsAuthModalOpen(true)}
                                        className="text-left text-gray-600 transition-colors hover:text-[#5555ff]"
                                    >
                                        {t('footer.startAsProvider')}
                                    </button>
                                )}
                            </li>
                            <li>
                                <Link href="/faq-provider" className="text-gray-600 hover:text-[#5555ff] transition-colors">
                                    {t('footer.faq')}
                                </Link>
                            </li>
                            <li>
                                <Link href="/support-provider" className="text-gray-600 hover:text-[#5555ff] transition-colors">
                                    {t('footer.support')}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Deskrl links */}
                    <div>
                        <h3 className="text-lg font-bold mb-4 text-gray-900">
                            {t('footer.deskrl')}
                        </h3>

                        <ul className="grid grid-cols-1 gap-3 text-sm">
                            <li>
                                <Link href="/about" className="text-gray-600 hover:text-[#5555ff] transition-colors">
                                    {t('footer.about')}
                                </Link>
                            </li>
                            <li>
                                <Link href="/career" className="text-gray-600 hover:text-[#5555ff] transition-colors">
                                    {t('footer.career')}
                                </Link>
                            </li>
                            <li>
                                <Link href="/legal-notice" className="text-gray-600 hover:text-[#5555ff] transition-colors">
                                    {t('footer.legalNotice')}
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms" className="text-gray-600 hover:text-[#5555ff] transition-colors">
                                    {t('footer.terms')}
                                </Link>
                            </li>
                            <li>
                                <Link href="/revocation" className="text-gray-600 hover:text-[#5555ff] transition-colors">
                                    {t('footer.revocation')}
                                </Link>
                            </li>
                            <li>
                                <Link href="/privacy-policy" className="text-gray-600 hover:text-[#5555ff] transition-colors">
                                    {t('footer.privacyPolicy')}
                                </Link>
                            </li>
                            <li>
                                <Link href="/accessibility" className="text-gray-600 hover:text-[#5555ff] transition-colors">
                                    {t('footer.accessibility')}
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-gray-600 hover:text-[#5555ff] transition-colors">
                                    {t('footer.contact')}
                                </Link>
                            </li>
                            <li>
                                <Link href="/news" className="text-gray-600 hover:text-[#5555ff] transition-colors">
                                    {t('footer.news')}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Social media links */}
                    <div>
                        <h3 className="text-lg font-bold mb-4 text-gray-900">
                            {t('footer.socialMedia')}
                        </h3>

                        <div className="flex items-center gap-3 flex-wrap mb-6">
                            {socialLinks.map(({ Icon, url, label }) => {
                                const IconComponent = Icon as any;

                                return (
                                    <a
                                        key={label}
                                        href={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-10 h-10 bg-gray-100 hover:bg-[#5555ff] text-gray-600 hover:text-white rounded-full flex items-center justify-center transition-all"
                                        aria-label={label}
                                    >
                                        <IconComponent className="w-5 h-5" />
                                    </a>
                                );
                            })}

                            <button
                                type="button"
                                onClick={() => {
                                    window.location.href = 'mailto:hello@deskrl.com';
                                }}
                                className="w-10 h-10 bg-gray-100 hover:bg-[#5555ff] text-gray-600 hover:text-white rounded-full flex items-center justify-center transition-all"
                                aria-label={t('footer.aria.email')}
                            >
                                <Mail className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="pt-8 border-t border-gray-200">
                    <div className="text-center text-xs text-gray-500">
                        {t('footer.copyright')}
                    </div>
                </div>
            </div>

            {/* Auth modal for guests */}
            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
            />
        </footer>
    );
}
