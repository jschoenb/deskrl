import { Link } from '@inertiajs/react';
import {BrowserRouter, Route, Routes} from "react-router";
import Users_old from "@/pages/Users_old";
import React from "react";

type Props = {
    children: React.ReactNode;
}

export default function Welcome({ children }: Props) {
    return (
        <div style={{ padding: '2rem' }}>
            <nav>
                <Link href="/">Go to Home</Link>
                <Link href="/users">Go to Users</Link>
                <Link href="/terms">Go to Terms</Link>

                <Link href="/terms">Go to AGB</Link>
            </nav>

            <main>
                {children}

            </main>

            <nav>

            </nav>





        </div>
    );
}
