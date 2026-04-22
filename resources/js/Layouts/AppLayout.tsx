import { Link } from '@inertiajs/react';
import {BrowserRouter, Route, Routes} from "react-router";
import Users_old from "@/pages/Users_old";
import React from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";

type Props = {
    children: React.ReactNode;
}

export default function Welcome({ children }: Props) {
    return (
        <div className="min-h-screen flex flex-col">
            {/* HEADER */}
            <Header />

            {/* CONTENT */}
            <main className="flex-grow w-full">
                {children}
            </main>

            {/* FOOTER */}
            <Footer />

        </div>
    );
}
