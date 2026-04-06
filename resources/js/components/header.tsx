import { Link } from '@inertiajs/react';
import { Button } from "@/components/ui/button";
import React from "react";

export default function Header() {
    return (
        <header className="flex items-center justify-between px-8 py-4 border-b bg-white sticky top-0 z-50">
            {/* Logo aus Figma */}
            <Link href="/" className="text-xl font-bold tracking-tight text-blue-900">
                deskrl
            </Link>

            {/* Navigation (Verlinkungen) */}
            <nav className="flex items-center gap-8">
                <Link href="/" className="font-bold text-xl">Search</Link>
                <Link href="/bookings" className="hover:underline">Bookings</Link>
                <Link href="/favorites" className="hover:underline">Favorites</Link>
            </nav>
        </header>
    );
}
