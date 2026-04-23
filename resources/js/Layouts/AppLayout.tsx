import React from "react";
import { usePage } from '@inertiajs/react';
import Header from "@/components/header";
import Footer from "@/components/footer";
import { FavoritesProvider } from '@/contexts/FavoritesContext';

type Props = {
    children: React.ReactNode;
}

export default function Welcome({ children }: Props) {
    const { props } = usePage();
    const { auth } = props as any;
    const isLoggedIn = !!auth?.user;

    return (
        <FavoritesProvider isLoggedIn={isLoggedIn}>
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-grow w-full">
                    {children}
                </main>
                <Footer />
            </div>
        </FavoritesProvider>
    );
}
