import '../css/app.css';
import { createInertiaApp } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { JSX, ReactNode } from 'react';
import { createRoot } from "react-dom/client";
import { FavoritesProvider } from '@/contexts/FavoritesContext';

createInertiaApp({
    resolve: async name => {
        const pages = import.meta.glob('./pages/**/*.tsx', { eager: true });

        const page = pages[`./pages/${name}.tsx`] as {
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

        root.render(
                <App {...props} />
        );
    },
});
