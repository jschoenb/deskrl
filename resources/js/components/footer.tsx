import { Link } from '@inertiajs/react';
import React from "react";
import { Mail } from 'lucide-react';
import { IconType } from "react-icons";
import { FaInstagram, FaLinkedinIn, FaFacebookF } from "react-icons/fa6";

//Rendering footer
export default function Footer() {

    //Icon & links for Social Media Channels
    const socialLinks: { Icon: IconType; url: string; label: string }[] = [
        { Icon: FaFacebookF, url: "https://facebook.com", label: "Facebook" },
        { Icon: FaInstagram, url: "https://instagram.com", label: "Instagram" },
        { Icon: FaLinkedinIn, url: "https://linkedin.com", label: "LinkedIn" },
    ];

    return (
        <footer className="bg-white border-t border-gray-200 mt-auto">
            <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">

                {/* Main Footer Content - Responsive Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8 text-left">

                    {/* Links for normal users */}
                    <div>
                        <h3 className="text-lg font-bold mb-4 text-gray-900">Für Nutzer:innen</h3>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/faq-user" className="text-gray-600 hover:text-[#5555ff] transition-colors">FAQ</Link></li>
                            <li><Link href="/cancellation" className="text-gray-600 hover:text-[#5555ff] transition-colors">Stornierungsmöglichkeiten</Link></li>
                            <li><Link href="/support-user" className="text-gray-600 hover:text-[#5555ff] transition-colors">Support</Link></li>
                        </ul>
                    </div>

                    {/* Links for providers */}
                    <div>
                        <h3 className="text-lg font-bold mb-4 text-gray-900">Für Anbieter:innen</h3>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/become-provider" className="text-gray-600 hover:text-[#5555ff] transition-colors">Als Anbieter:in loslegen</Link></li>
                            <li><Link href="/faq-provider" className="text-gray-600 hover:text-[#5555ff] transition-colors">FAQ</Link></li>
                            <li><Link href="/support-provider" className="text-gray-600 hover:text-[#5555ff] transition-colors">Support</Link></li>
                        </ul>
                    </div>

                    {/* Links for Deskrl */}
                    <div>
                        <h3 className="text-lg font-bold mb-4 text-gray-900">Deskrl</h3>
                        <ul className="grid grid-cols-1 gap-3 text-sm">
                            <li><Link href="/about" className="text-gray-600 hover:text-[#5555ff] transition-colors">Über Deskrl</Link></li>
                            <li><Link href="/career" className="text-gray-600 hover:text-[#5555ff] transition-colors">Karriere</Link></li>
                            <li><Link href="/legal-notice" className="text-gray-600 hover:text-[#5555ff] transition-colors">Impressum</Link></li>
                            <li><Link href="/terms" className="text-gray-600 hover:text-[#5555ff] transition-colors">AGB</Link></li>
                            <li><Link href="/revocation" className="text-gray-600 hover:text-[#5555ff] transition-colors">Widerruf</Link></li>
                            <li><Link href="/privacy-policy" className="text-gray-600 hover:text-[#5555ff] transition-colors">Datenschutz</Link></li>
                            <li><Link href="/accessibility" className="text-gray-600 hover:text-[#5555ff] transition-colors">Barrierefreiheit</Link></li>
                            <li><Link href="/contact" className="text-gray-600 hover:text-[#5555ff] transition-colors">Kontakt</Link></li>
                            <li><Link href="/news" className="text-gray-600 hover:text-[#5555ff] transition-colors">News</Link></li>
                        </ul>
                    </div>

                    {/* Social Media Buttons */}
                    <div>
                        <h3 className="text-lg font-bold mb-4 text-gray-900">Social Media</h3>
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
                                onClick={() => window.location.href = 'mailto:hello@deskrl.com'}
                                className="w-10 h-10 bg-gray-100 hover:bg-[#5555ff] text-gray-600 hover:text-white rounded-full flex items-center justify-center transition-all"
                                aria-label="E-Mail"
                            >
                                <Mail className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-gray-200">
                    <div className="text-center text-xs text-gray-500">
                        © 2026 Deskrl. Alle Rechte vorbehalten.
                    </div>
                </div>
            </div>
        </footer>
    );
}
