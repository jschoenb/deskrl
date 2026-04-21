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
            <h2>welcome seite</h2>





        </div>
    );
}
