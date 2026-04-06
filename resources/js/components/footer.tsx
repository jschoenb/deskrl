/*
import { Link } from '@inertiajs/react';
import { Button } from "@/components/ui/button";
import React from "react";

export default function Footer() {
    return (
        <footer className="border-t bg-gray-50 p-8 text-center text-sm text-gray-500">
            <nav className="max-w-7xl mx-auto flex justify-between items-center">
                <div className="space-x-4">
                    <Link href="/privacy-policy" className="hover:underline">Privacy Policy</Link>
                    <Link href="/terms" className="hover:underline">Terms</Link>
                    <Link href="/legal-notice" className="hover:underline">Legal Notice</Link>
                </div>
            </nav>
        </footer>
    );
}
*/

import { Link } from '@inertiajs/react';
import React from "react";
import { Search, Share2, Bookmark, Mail } from 'lucide-react';
import { IconType } from "react-icons";
import { FaInstagram, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default function Footer() {

    const handleShare = async () => {
        try {
            if (navigator.share) {
                await navigator.share({
                    title: 'Deskrl',
                    text: 'Finde deinen perfekten Arbeitsplatz',
                    url: window.location.origin,
                });
            } else {
                await navigator.clipboard.writeText(window.location.origin);
                alert('Link in die Zwischenablage kopiert!');
            }
        } catch (error) {
            console.log('Share abgebrochen oder fehlgeschlagen');
        }
    };

    const socialLinks: { Icon: IconType; url: string; label: string }[] = [
        { Icon: FaXTwitter, url: "https://x.com", label: "X" },
        { Icon: FaInstagram, url: "https://instagram.com", label: "Instagram" },
        { Icon: FaLinkedin, url: "https://linkedin.com", label: "LinkedIn" },
    ];

    return (
        <footer className="bg-white border-t border-gray-200 mt-auto">
            <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">

                {/* Main Footer Content */}
                <div className="grid md:grid-cols-4 gap-8 mb-8">

                    {/* Logo & Brand Bereich */}
                    <div className="md:col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-4 group">
                            <div className="text-4xl transition-transform group-hover:scale-110">😊</div>
                            <span className="text-2xl text-[#5555ff] font-bold">
                                Deskrl
                            </span>
                        </Link>
                        <p className="text-gray-600 mb-6 leading-relaxed max-w-md">
                            Finde und buche flexible Arbeitsplätze in deiner Nähe.
                            Einfach, schnell und produktiv arbeiten – wo immer du bist.
                        </p>
                        <div className="inline-flex items-center gap-2 px-6 py-3 bg-[#f5f5ff] rounded-xl border border-[#5555ff]/20">
                            <span className="text-[#5555ff] text-lg font-bold">
                                deskrl.com
                            </span>
                        </div>
                    </div>

                    {/* Quick Actions Spalte */}
                    <div>
                        <h3 className="text-lg font-bold mb-4 text-gray-900">
                            Suchen & Finden
                        </h3>
                        <ul className="space-y-3">
                            <li>
                                <Link
                                    href="/"
                                    className="text-gray-600 hover:text-[#5555ff] transition-colors flex items-center gap-2"
                                >
                                    <Search className="w-4 h-4" />
                                    Arbeitsplatz finden
                                </Link>
                            </li>
                            <li>
                                <button
                                    onClick={handleShare}
                                    className="text-gray-600 hover:text-[#5555ff] transition-colors flex items-center gap-2"
                                >
                                    <Share2 className="w-4 h-4" />
                                    Teilen
                                </button>
                            </li>
                            <li>
                                <Link
                                    href="/favorites"
                                    className="text-gray-600 hover:text-[#5555ff] transition-colors flex items-center gap-2"
                                >
                                    <Bookmark className="w-4 h-4" />
                                    Gespeichert
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Social Media Spalte */}
                    <div>
                        <h3 className="text-lg font-bold mb-4 text-gray-900">
                            Social Media
                        </h3>
                        <div className="flex items-center gap-3 mb-6">
                            {socialLinks.map(({ Icon, url, label }) => {
                                // TRICK: Wir weisen das Icon einer lokalen Variable mit Großbuchstaben zu
                                // und sagen TypeScript mit "as any", dass es aufhören soll zu meckern.
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
                            <a
                                href="mailto:hello@deskrl.com"
                                className="w-10 h-10 bg-gray-100 hover:bg-[#5555ff] text-gray-600 hover:text-white rounded-full flex items-center justify-center transition-all"
                                aria-label="E-Mail"
                            >
                                <Mail className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-gray-200">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-600">
                        <div>© 2026 Deskrl. Alle Rechte vorbehalten.</div>
                        <div className="flex items-center gap-6">
                            <Link href="/privacy-policy" className="hover:text-[#5555ff] transition-colors">
                                Datenschutz
                            </Link>
                            <Link href="/terms" className="hover:text-[#5555ff] transition-colors">
                                AGB
                            </Link>
                            <Link href="/legal-notice" className="hover:text-[#5555ff] transition-colors">
                                Impressum
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
