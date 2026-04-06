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
