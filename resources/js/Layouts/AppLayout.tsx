import React from 'react';
import { usePage } from '@inertiajs/react';
import Header from '@/components/header';
import Footer from '@/components/Footer';
import { FavoritesProvider } from '@/contexts/FavoritesContext';
import { Toaster } from 'sonner';

type AppLayoutProps = {
    children: React.ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps): React.ReactElement {
    const { props } = usePage();
    const { auth } = props as any;

    // Check whether a user is currently logged in.
    const isLoggedIn = Boolean(auth?.user);

    return (
        <FavoritesProvider isLoggedIn={isLoggedIn}>
            {/* Main page structure with shared header and footer */}
            <div className="flex min-h-screen flex-col">
                {/* Global page header */}
                <Header />

                {/* Page-specific content rendered by Inertia */}
                <main className="w-full flex-grow">
                    {children}
                </main>

                {/* Global page footer */}
                <Footer />
            </div>

            {/* Global toast notifications */}
            <Toaster position="bottom-right" richColors />
        </FavoritesProvider>
    );
}
