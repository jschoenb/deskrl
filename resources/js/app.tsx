/*
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import '../css/app.css';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) =>
        resolvePageComponent(
            `./pages/${name}.tsx`,
            import.meta.glob('./pages/!**!/!*.tsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);


    },
    progress: {
        color: '#4B5563',
    },
});
*/

// resources/js/app.tsx

import { createInertiaApp } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import {JSX, ReactNode} from 'react';
import {createRoot} from "react-dom/client";

createInertiaApp({
    resolve: async name => {
        const pages = import.meta.glob('./Pages/**/*.tsx', { eager: true });

        const page = pages[`./Pages/${name}.tsx`] as {
            default: {
                layout?: (page: ReactNode) => JSX.Element;
            };
        };

        page.default.layout =
            page.default.layout ||
            ((page: ReactNode) => <AppLayout>{page}</AppLayout>);

        return page;
    },

    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);


    },
});


